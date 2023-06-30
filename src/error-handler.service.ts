/* <<-- This is a custom error class that extends the built-in Error class. 
    It is used to represent an error when the input is invalid. 
    It takes a message parameter, which is the error message to be displayed-->> */
export class InvalidInputError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidInputError';
    }
}

/* This is a custom error class that represents an error when a cinema is not found. 
        It extends the Error class and does not require any additional parameters.*/
export class CinemaNotFoundError extends Error {
    constructor() {
        super('Cinema not found');
        this.name = 'CinemaNotFoundError';
    }
}

/* This is a custom error class that represents an error when a seat is not found. 
        It extends the Error class and does not require any additional parameters.*/
export class SeatNotFoundError extends Error {
    constructor() {
        super('Seat not found');
        this.name = 'SeatNotFoundError';
    }
}
/* This is a custom error class that represents an error when a seat is already purchased. 
        It extends the Error class and does not require any additional parameters.*/
export class SeatAlreadyPurchasedError extends Error {
    constructor() {
        super('Seat already purchased');
        this.name = 'SeatAlreadyPurchasedError';
    }
}
