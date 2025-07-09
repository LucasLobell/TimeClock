export interface INewUser {
    name: string;
    email: string;
    username: string;
    password: string;
};

export interface TimeEntry {
    morningEntry?: string;
    morningExit?: string;
    afternoonEntry?: string;
    afternoonExit?: string;
}