interface ArticlePropsInterface {
  description: string;
  id: string;
  title: string;
}

export class Article {
  public readonly description: string;
  public readonly id: string;
  public readonly title: string;
  constructor(props: ArticlePropsInterface) {
    this.id = props.id;
    this.description = props.description;
    this.title = props.title;
  }
}
