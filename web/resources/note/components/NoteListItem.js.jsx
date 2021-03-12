// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

import * as userActions from "../../user/userActions";

class NoteListItem extends React.Component {
  state = {
    commentAuthor: "",
  };

  componentDidMount = () => {
    const { note, dispatch } = this.props;
    dispatch(userActions.fetchSingleUserById(note._user)).then((res) => {
      const { firstName, lastName } = res.item;
      this.setState({
        commentAuthor: `${firstName} ${lastName}`,
      });
    });
  };

  render() {
    const { note, dispatch } = this.props;
    const { commentAuthor } = this.state;

    return (
      <div>
        <h4 style={{ fontWeight: "bold" }}>{commentAuthor}</h4>
        <i style={{ fontSize: "12px" }}>
          {moment(note.updated).format("M/D/YYYY @ h:mmA")}
        </i>
        <br />
        <span style={{ fontWeight: "bold" }}>{note.content}</span>
      </div>
    );
  }
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired,
};

export default NoteListItem;
