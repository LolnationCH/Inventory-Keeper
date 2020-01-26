import * as React from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import { GetBookData } from "../queries/BookQuery";
import { Book, defaultThumbnail } from "../data/book";
import { Link } from "react-router-dom";

export class BookPage extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: null
    };
  }

  render() {
    const books = GetBookData() as Array<Book>;
    var id = this.props.match.params.id;
    var book = books.find(function(item: Book) {
      return item.identifier.identifier === id;
    });

    var thumbnail = book?.thumbnail;
    if (book?.thumbnail === undefined)
      thumbnail = defaultThumbnail;
    console.log(book);
    return(
    <div>
      <p/>
      <Grid container spacing={0}>
        <Grid item>
          <Button component={Link} to={"/books/" + book?.identifier.identifier}>
            <img className="Big-thumbnail" src={thumbnail as string|undefined} alt={book?.title  as string|undefined}/>
          </Button>
        </Grid>
        <Grid item xs>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Title" label="Title" variant="outlined" value={book? book.title : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Authors" label="Authors" variant="outlined" value={book? book.authors : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Volume" label="Volume" variant="outlined" value={book? book.volumeNumber : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Publisher" label="Publisher" variant="outlined" value={book? book.publisher : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="PublisherDate" label="Publisher Date" variant="outlined" value={book ?book.publishedDate : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="PageCount" label="Page Count" variant="outlined" value={book? book.pageCount : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Language" label="Language" variant="outlined" value={book? book.language : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="ISBN" label="ISBN" variant="outlined" value={book? book.identifier.identifier : ""}/>
          <TextField style={{margin:"10px"}} fullWidth={true} id="Type" label="Type" variant="outlined" value={book? book.type : ""}/>
        </Grid>
      </Grid>
      <TextField multiline={true} style={{margin:"10px"}} fullWidth={true} id="Description" label="Description" variant="outlined" value={book? book.description: ""}/>
    </div>
    )
  }
}