import { SchemaTypes } from '@datocms/cma-client';

type Account = SchemaTypes.Account;
type Field = SchemaTypes.Field;
type Item = SchemaTypes.Item;
type ItemType = SchemaTypes.ItemType;
type Plugin = SchemaTypes.Plugin;
type Site = SchemaTypes.Site;
type SsoUser = SchemaTypes.SsoUser;
type Upload = SchemaTypes.Upload;
type User = SchemaTypes.User;
type Role = SchemaTypes.Role;

export type {
  Account,
  Field,
  Item,
  ItemType,
  Plugin,
  Site,
  SsoUser,
  Upload,
  User,
  Role,
};

export * from './connect';
export * from './types';
