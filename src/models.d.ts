import { AccountDetailsProp, ContactProp, TaskProp, UserProp } from './types';

export interface LoginRequest {
  UserName: string;
  Password: string;
}

export type LoginResponse = UserProp

export interface AccountsGetResponse extends AccountDetailsProp {
  FullName: string;
  FullAdress: string;
  UserName: string;
}

export interface AccountAssignUserRequest {
  UserId: string;
  AccountIds: string[];
}

export class AccountRequest implements AccountDetailsProp {
  AccountNumber: '';
  Amount: 0;
  City: 'Mazatlán';
  Country: 'México';
  Email: '';
  FirstName: '';
  LastName: '';
  Latitud: 0;
  Longitud: 0;
  MiddleName: '';
  Mobile: '';
  NotificationLocation: '';
  Phone: '';
  PostalCode: '82000';
  State: 'Sinaloa';
  Street: '';

  constructor(account: Partial<AccountDetailsProp>) {
    this.AccountNumber = '';
    this.Amount = 0;
    this.City = 'Mazatlán';
    this.Country = 'México';
    this.Email = '';
    this.FirstName = '';
    this.LastName = '';
    this.Latitud = 0;
    this.Longitud = 0;
    this.MiddleName = '';
    this.Mobile = '';
    this.NotificationLocation = '';
    this.Phone = '';
    this.PostalCode = '82000';
    this.State = 'Sinaloa';
    this.Street = '';

    if (!account) {
      return;
    }


    Object.assign(this, account);
  }

  static New(): AccountRequest {
    const newAccount = new AccountRequest(null);

    return newAccount;
  }
}

export interface UserGetResponse extends UserProp {
  FullName: string;
  Status: string
}

export interface UserRequestProp {
  Address: string;
  Email: string;
  FirstName: string;
  Id?: number;
  IsActive: boolean,
  LastName: string;
  MiddleName: string;
  Mobile: string;
  Phone: string;
  UserName: string;
}

export const UserRequest = function (user: UserGetResponse): UserRequestProp {
  this.Address = user.Address;
  this.Email = user.Email;
  this.FirstName = user.FirstName;
  this.Id = user.Id;
  this.IsActive = user.IsActive;
  this.LastName = user.LastName;
  this.MiddleName = user.MiddleName;
  this.Mobile = user.Mobile;
  this.Phone = user.Phone;
  this.UserName = user.UserName;
};

export interface LastTaskGetResponse extends TaskProp {
  AccountName: string;
  TypeNotification: string;
  ContactName: string;
}

export interface TaskGetResponse extends TaskProp {
  AccountName?: string;
  AccountNumber?: string;
  TypeNotification: string;
  ContactName: string;
}

export interface CountTotal {
  count: number;
}

export interface ContactAccountResponse extends ContactProp {
  FullName: string;
}

export type CreateContactPayload = ContactProp
