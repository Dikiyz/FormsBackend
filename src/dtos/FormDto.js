export default class FormDto {
    id;
    name;
    description;
    author_id;
    create_data;
    have_picture;

    constructor({ id, name, description, author_id, create_data, have_picture = false }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.author_id = author_id;
        this.create_data = create_data;
        this.have_picture = have_picture;
    }
};