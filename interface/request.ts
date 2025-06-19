export enum RequestTypeOperation {
    create = "create",
    update = "update",
    delete = "delete"
}

export interface NoteRequest {
    operation: RequestTypeOperation;
    data: NoteData;
}

export interface NoteData {
    user_id: string;
    chat_id: string;
    content: string;
}

export interface PromptRequest {
    operation: RequestTypeOperation;
    data: Prompt;
}

export interface Prompt {
    user_id: string;
    title: string;
    content: string;
}


