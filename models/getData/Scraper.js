const rp = require('request-promise'),
      $ = require('cheerio');

class Scraper{
  /*
		scrap - consults the specified page and returns the html of that page.
	*/
  static async scrap(URL, encoding){
    let pageContent = await new Promise((resolve, reject) => {
			let config = {
				uri: URL,
				encoding: encoding
			};

			rp(config)
				.then( html => {
					resolve(html);
				})
				.catch( err => {
					reject(err);
				});
		});

		return pageContent;
  }

  static getElementsFromHTML({cssSelector, html, filter, steps = [0, 1]} = {}){
      let elements = $(cssSelector, html),
          elementsFiltered = [];

      for (let i = steps[0]; i < Object.keys(elements).length; i += steps[1]) {
          if(typeof elements[i] == 'undefined') continue;
          elementsFiltered.push(filter(elements[i]));
      }

      return elementsFiltered;
  }
}

module.exports = Scraper;
