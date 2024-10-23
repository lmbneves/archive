export type Archive = {
  id: string;
  name: string;
};

export type Item = {
  id: string;
  archive_id: string;
  name: string;
};