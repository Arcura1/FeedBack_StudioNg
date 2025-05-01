import {AuthorityType} from "./authorıtyType";

export const AuthorityTypeOptions = [
  { label: 'Seçiniz', value: null },
  { label: 'Organization', value: AuthorityType.ORGANIZATION },
  { label: 'Classroom', value: AuthorityType.CLASSROOM },
  { label: 'Homework', value: AuthorityType.HOMEWORK },
  { label: 'PDF Edit', value: AuthorityType.PDF_EDIT },
  { label: 'Classroom User', value: AuthorityType.CLASSROOM_USER }
];
