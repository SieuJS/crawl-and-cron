import { ConfDate } from "./confdate";

export interface Conference {
    Id : string ;
    Title : string ;
    Acronym : string ;
    Source : string ;
    Rank : string ;
    Note : string ;
    DBLP : string ;
    PrimaryFor : string ;
    AverageRating : string ;
    Links : string[];
    ConferenceDate : ConfDate[] ;
    SubmissionDate : ConfDate[] ;
    NotificationDate : ConfDate[] ;
    Comments : string;
    Type : string ;
    Location : string ;
}