interface ArticlePropsInterface {
  description: string;
  id: number;
  title: string;
  userId: number;
}

export class Article {
  public readonly description: string;
  public readonly id: number;
  public readonly title: string;
  public readonly userId: number;
  constructor(props: ArticlePropsInterface) {
    this.id = props.id;
    this.description = props.description;
    this.title = props.title;
    this.userId = props.userId;
  }
}
