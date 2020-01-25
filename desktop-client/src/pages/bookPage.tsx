import * as React from "react";
import { TextField, Grid, Button, Box } from "@material-ui/core";
import { GetBookData } from "../queries/BookQuery";
import { Book } from "../data/book";
import { Link } from "react-router-dom";

export class BookPage extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {id: null};
  }

  render() {
    const books = GetBookData() as Array<Book>;
    var id = this.props.match.params.id;
    var book = books.find(function(item: Book) {
      return item.identifier.identifier === id;
    });
    
    return(
    <div>
      <p/>
      <Grid container spacing={0}>
        <Grid item>
          <Button component={Link} to={"/books/" + book?.identifier.identifier}>
            <img className="Big-thumbnail" src={book?.thumbnail as string|undefined} alt={book?.title  as string|undefined}/>
          </Button>
        </Grid>
        <Grid item xs>
          <TextField size="medium" id="Title" label="Title" variant="outlined" defaultValue={book?.title}/>
          <TextField id="Authors" label="Authors" variant="outlined" defaultValue={book?.authors}/>
          <TextField id="Volume" label="Volume" variant="outlined" defaultValue={book?.volumeNumber}/>
          <TextField id="Publisher" label="Publisher" variant="outlined" defaultValue={book?.publisher}/>
          <TextField id="PublisherDate" label="Publisher Date" variant="outlined" defaultValue={book?.publishedDate}/>
          <TextField id="PageCount" label="Page Count" variant="outlined" defaultValue={book?.pageCount}/>
          <TextField id="Language" label="Language" variant="outlined" defaultValue={book?.language}/>
          <TextField id="ISBN" label="ISBN" variant="outlined" defaultValue={book?.identifier.identifier}/>
          <TextField id="Type" label="Type" variant="outlined" defaultValue={book?.type}/>
        </Grid>
      </Grid>
    </div>
    )
  }
}