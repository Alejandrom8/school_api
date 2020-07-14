const rp = require('request-promise'),
			$ = require('cheerio'),
			Asignatura = require('./Asignatura'),
			Scraper = require('./Scraper');

/*
	Materiales - an object that gets the URL's of the 'apuntes' and 'actividades'
	of each subject of the specified semester.
*/
class Materiales{
	/*
		@param {number} semestreID - the number of the semester that will be geted
		the URL's.
	*/
	constructor(semestreID){
		//where we are going to get the data.
		this.baseURL = "http://fcasua.contad.unam.mx/apuntes/interiores/";
		this.semestreID =  semestreID;
		this.plan = '2016'; //the year of the study plan
	}

	/*
		getMateriales - returns an array with the subjects of the specified semester.
		@return {Array} - an array of Asignatura objects.
	*/
	async getMateriales(){
		const url = `${this.baseURL}plan${this.plan}_${this.semestreID}.php`;
		const pageContent = await Scraper.scrap(url, 'utf8');
		const materiales_asignaturas = this.processHTML(pageContent);
		return materiales_asignaturas;
	}

	getElementsFromHTML(cssSelector, html){
  	const elements = $(cssSelector, html);
    let elementsFiltered = [],
				linkCounter = 0,
				element;

    for (let i = 0; i < Object.keys(elements).length; i++) {
        if(typeof elements[i] == 'undefined') continue;

      	if(linkCounter >= 2){
					if(!('attribs' in elements[i].children[0])){
						elementsFiltered.push(null);
						continue;
					}
					if(!('href' in elements[i].children[0].attribs)){
						elementsFiltered.push(null);
						continue;
					}
					element = this.baseURL + elements[i].children[0].attribs.href;
      		elementsFiltered.push(element);
      	}else{
					elementsFiltered.push(elements[i].children[0].data);
      	}
        linkCounter = linkCounter == 3 ? 0 : linkCounter+1;
    }

    return elementsFiltered;
  }

  classifySubjects(subjects){
  	let sorted = [];
		let clave, nombre, apunteURL, actividadesURL, subject;

  	for(let i = 0; i < subjects.length; i += 4){
  		clave = typeof subjects[i] == 'undefined' ? subjects[i+1] : subjects[i];
			clave = (clave.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim();
  		nombre = subjects[i+1];
  		apunteURL = subjects[i+2];
  		actividadesURL = subjects[i+3];

  		subject = new Asignatura(nombre, clave, '', apunteURL, actividadesURL);
  		sorted.push(subject);
  	}

  	return sorted;
  }

	processHTML(html){
		//gettin the 'claves'. patron: center-left-center-center. [clave, nombre, apunte, actividades];
		const selector_1 = 'table.tablaamarilla > tbody tr > td.tablaamarilla[valign="middle"][bgcolor="#E6E6E6"]',
				  selector_2 = 'table.tablaamarilla > tbody tr > td.estilos[valign="middle"][bgcolor="#E6E6E6"]';

		let subjects_materials = this.getElementsFromHTML(`${selector_1}, ${selector_2}`, html);
		subjects_materials = this.classifySubjects(subjects_materials);

		return subjects_materials;
	}
}

module.exports = Materiales;
