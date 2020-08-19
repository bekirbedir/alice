

export class GetActivities {
    static readonly type = '[Activity] Get';

    constructor() {
    }
}

export class GetActivityDetail {
    static readonly type = '[Activity]';
    constructor(public id) {
    }
}

