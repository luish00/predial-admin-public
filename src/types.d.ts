export interface AccountType {
  id: string;
  name: string;
  address: string;
}

export interface AccountDetailsProp {
  Id?: number;
  AccountNumber?: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  NotificationLocation?: string;
  Street?: string;
  PostalCode?: string;
  City?: string;
  State?: string;
  Country?: string;
  Latitud?: number;
  Longitud?: number;
  Amount?: number;
  Phone?: string;
  Mobile?: string;
  Email?: string;
  Assigned2UserId?: number;
  Status?: string;
}

export interface AttachmentProp {
  Name: string;
  Type: string;
  ParentId: string;
  AccountId: string;
  Body: string;
}

export interface ContactProp {
  Id: int; // add to backend
  IsOwner: boolean;
  Name?: string;
  Relationship: string;
  FirstName: string;
  MiddleName?: string;
  LastName?: string;
  Phone?: string;
  Mobile?: string;
  Email?: string;
  AccountId: string;
}

export interface UserProp {
  access_token: string;
  Address: string;
  Address?: string;
  Email?: string;
  FirstName: string;
  Id: number;
  IsActive: boolean;
  LastName?: string;
  MiddleName?: string;
  Mobile?: string;
  Phone?: string;
  UserName: string;
}

export interface TaskProp {
  AccountId: string;
  ContactId: string;
  CreatedDate: string;
  Email?: string;
  InstructionNotification: boolean;
  Mobile?: string;
  Name?: string; // no back
  PaymentPromise: string;
  PersonalNotification: boolean;
  Phone?: string;
}

type TaskListStatusType = 1 | 2 | 3;
// no existe en back aun
export interface TaskListProps {
  id: string;
  date: string;
  isComplete: boolean;
  type: TaskListStatusType;
}
