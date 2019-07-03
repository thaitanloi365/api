declare module "@types" {
  import { Document, Model, HookSyncCallback, QueryPopulateOptions, ModelPopulateOptions } from "mongoose";
  import { RequestHandler, Response, NextFunction, ErrorRequestHandler, Request } from "express";
  /**
   * Common
   */
  export type ErrorRequestHandler = ErrorRequestHandler;
  export type RequestHandler = RequestHandler;
  export type Response = Response;
  export type Request = Request;
  export type NextFunction = NextFunction;
  export type Populate = QueryPopulateOptions | QueryPopulateOptions[];
  /**
   * Mailer model
   */
  export type MailerOptions = Partial<{
    to: string;
    from: string;
    subject: string;
    html: string;
    text: string;
  }>;

  export type MailerSendData = Partial<{ baseUrl: string; user: any }>;

  /**
   * User model
   * */
  export interface IUserDocument extends Document {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    salt: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    devices: Array<{ token: string; uuid: string; platform: string }>;
    items: Array;
  }

  export interface IUser extends IUserDocument {
    /**
     * Helper
     */
    isEmailExits(email: string): boolean;
    authenticate(password: string): Promise<boolean>;
    saveResetToken(): void;
    generateSalt(): Promise<string>;
    encryptPassword(): Promise<string>;
    generateResetToken(callback: (error: Error, resetToken?: string) => void);
    saveResetToken(): Promise<IUserDocument>;
  }

  export interface IUserModel extends Model<IUser> {
    /**
     * Handle login
     */
  }

  /**
   * Thread model
   */
  export interface IItemDocument extends Document {
    title: string;
    description: stirng;
    price: number;
    _createdBy: IUser;
  }

  export interface IItem extends IUserDocument {
    /**
     * Helper
     */
  }

  export interface IItemModel extends Model<IItem> {
    /**
     * Handle login
     */
  }
}
