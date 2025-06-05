// src/admin/events.js
import React from 'react';
import {
  List, Datagrid, TextField, DateField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, DateTimeInput, BooleanInput,
  Create, FileInput, ImageField, SelectInput
} from 'react-admin';

export const EventList = props => (
  <List {...props} title="События">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" label="Название" />
      <DateField source="dateTime" label="Дата и время" showTime />
      <TextField source="location" />
      <BooleanField source="isRegistrationOpen" label="Регистрация" />
      <EditButton />
    </Datagrid>
  </List>
);

export const EventEdit = props => (
  <Edit {...props} title="Редактировать событие">
    <SimpleForm>
      <TextInput source="name" label="Название" fullWidth />
      <DateTimeInput source="dateTime" label="Дата и время" />
      <TextInput source="location" label="Место" fullWidth />
      <TextInput source="description" label="Описание" multiline fullWidth />
      <TextInput source="linkToAlbum" label="Ссылка на альбом" fullWidth />
      <TextInput source="teamResult" label="Результат команды" fullWidth />
      <BooleanInput source="isRegistrationOpen" label="Регистрация открыта" />
      <BooleanInput source="isHidden" label="Скрыто" />
      <FileInput source="posterFile" label="Афиша" accept="image/*">
        <ImageField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

export const EventCreate = props => (
  <Create {...props} title="Новое событие">
    <SimpleForm>
      <TextInput source="name" label="Название" fullWidth />
      <DateTimeInput source="dateTime" label="Дата и время" />
      <TextInput source="location" label="Место" fullWidth />
      <TextInput source="description" label="Описание" multiline fullWidth />
      <TextInput source="linkToAlbum" label="Ссылка на альбом" fullWidth />
      <TextInput source="teamResult" label="Результат команды" fullWidth />
      <BooleanInput source="isRegistrationOpen" label="Регистрация открыта" defaultValue />
      <BooleanInput source="isHidden" label="Скрыто" defaultValue={false} />
      <FileInput source="posterFile" label="Афиша" accept="image/*">
        <ImageField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);
