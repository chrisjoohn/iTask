/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as taskActions from "../taskActions";
import * as noteActions from "../../note/noteActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import TaskLayout from "../components/TaskLayout.js.jsx";
import NoteListItem from "../../note/components/NoteListItem.js.jsx";
import ApprovalButtons from "../components/ApprovalButtons.js.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);
  }

  state = {
    commentInput: "",
  };

  CommentOnChange = (e) => {
    const value = e.target.value;
    this.setState({
      commentInput: value,
    });
  };

  SubmitComment = (e) => {
    e.preventDefault();
    const {
      dispatch,
      match,
      userStore: {
        loggedIn: {
          user: { _id: _userId },
        },
      },
    } = this.props;

    const { commentInput } = this.state;

    dispatch(
      noteActions.sendCreateNote({
        _task: match.params.taskId,
        _user: _userId,
        content: commentInput,
      })
    );

    this.setState({
      commentInput: "",
    });
  };

  onApprove = () => {
    const { taskStore, dispatch } = this.props;
    const selectedTask = taskStore.selected.getItem();
    dispatch(
      taskActions.sendUpdateTask({ ...selectedTask, status: "approved" })
    );
  };

  onReject = () => {
    const { taskStore, dispatch } = this.props;
    const selectedTask = taskStore.selected.getItem();
    dispatch(
      taskActions.sendUpdateTask({
        ...selectedTask,
        status: "open",
        complete: false,
      })
    );
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchList("_task", match.params.taskId));
  }

  render() {
    const {
      taskStore,
      noteStore,
      match,
      dispatch,

      userStore: {
        loggedIn: {
          user: { roles },
        },
      },
    } = this.props;

    let notesId = noteStore.byId;

    const notesListItems = Object.keys(notesId)
      .map((key) => {
        if (notesId[key]._task === match.params.taskId) {
          return notesId[key];
        }
      })
      .filter((item) => item);
    //const notesListItems = noteStore.util.getList("_task", match.params.taskId);

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;

    const isAdmin = roles && roles.includes("admin");

    const TaskIconStatus = () => {
      if (selectedTask.status === "approved") {
        return "Approved!";
      }

      if (selectedTask.status === "awaiting_approval") {
        return "Awaiting Approval";
      }

      return "Open";
    };

    return (
      <TaskLayout>
        <h3> Single Task </h3>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <TaskIconStatus />
            <h1> {selectedTask.name}</h1>
            {isAdmin &&
              selectedTask.status === "awaiting_approval" &&
              selectedTask.complete && (
                <ApprovalButtons
                  onApprove={this.onApprove}
                  onReject={this.onReject}
                />
              )}
            <hr />
            <p>
              {" "}
              <em>{selectedTask.description}</em>
            </p>
            <br />
            <Link to={`${this.props.match.url}/update`}> Update Task </Link>
            <br />
            <br />
            {/*<NoteList dispatch={dispatch} taskId={match.params.taskId} />*/}
            <ul>
              {notesListItems &&
                notesListItems.map((item) => {
                  return (
                    <NoteListItem
                      key={item._id}
                      note={item}
                      dispatch={dispatch}
                    />
                  );
                })}
            </ul>
            <form onSubmit={this.SubmitComment}>
              <textarea
                required
                value={this.state.commentInput}
                onChange={this.CommentOnChange}
              ></textarea>
              <br />
              <button type="submit">Add Comment</button>
            </form>
          </div>
        )}
      </TaskLayout>
    );
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    taskStore: store.task,
    userStore: store.user,
    noteStore: store.note,
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
