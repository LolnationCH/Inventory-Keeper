import * as React from "react";

export class BookPage extends React.Component<any> {
  render() {
    return (
      <div>
        {this.props.match.params.id}
      </div>
    );
  }
}