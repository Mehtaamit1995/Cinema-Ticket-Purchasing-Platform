export interface Seat {
    id: number;
    cinemaId: number;
    isPurchased: boolean;
}

export interface Cinema {
    id: number;
    seats: Seat[];
}
