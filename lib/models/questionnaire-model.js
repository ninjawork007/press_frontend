export default class QuestionnaireModel {
  constructor(data) {
    this.id = data?.id;
    this.name = data?.attributes?.name;
    this.updatedAt = data?.attributes?.updatedAt;
    this.createdAt = data?.attributes?.createdAt;
    this.description = data.attributes.description;
    this.file = data.attributes.file?.data;
    this.type = data.attributes.type;
  }
}
