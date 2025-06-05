// src/admin/teams.js
import React from 'react';
import {
  List, Datagrid, TextField, EditButton,
  Edit, SimpleForm, TextInput, Create
} from 'react-admin';

export const TeamList = props => (
  <List {...props} title="Команды">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" label="Название" />
      <TextField source="inviteCode" label="Код приглашения" />
      <EditButton />
    </Datagrid>
  </List>
);

export const TeamEdit = props => (
  <Edit {...props} title="Редактировать команду">
    <SimpleForm>
      <TextInput source="name" label="Название команды" fullWidth />
      <TextInput source="inviteCode" label="Код приглашения" disabled />
    </SimpleForm>
  </Edit>
);

export const TeamCreate = props => (
  <Create {...props} title="Новая команда">
    <SimpleForm>
      <TextInput source="name" label="Название команды" fullWidth />
      {/* inviteCode сгенерится на сервере */}
    </SimpleForm>
  </Create>
);
