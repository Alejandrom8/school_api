class CompleteSubject {
    static getInstance(subject, scheduledSubject) {
        return {...subject, ...scheduledSubject};
    }
}

module.exports = CompleteSubject;