declare module "@types" {
  import { Document, Model, HookSyncCallback } from "mongoose";
  import { RequestHandler, Response, NextFunction, ErrorRequestHandler } from "express";
  /**
   * Common
   */
  export type ErrorRequestHandler = ErrorRequestHandler;
  export type RequestHandler = RequestHandler;
  export type Response = Response;
  export type NextFunction = NextFunction;

  // export type ErrorNames =
  //   | "INTERNAL_SERVER_ERROR"
  //   | "USER_NOT_FOUND"
  //   | "EMAIL_ALREADY_EXITS"
  //   | "EMAIL_INVALID"
  //   | "CREATE_ACCOUNT_SUCCESS"
  //   | "UPDATE_ACCOUNT_SUCCESS";

  // export type Errors = { [key in ErrorNames]: string };

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
}
