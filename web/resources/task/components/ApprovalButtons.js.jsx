import React from "react";

const ApprovalButtons = ({ onApprove, onReject }) => {
  return (
    <div>
      <button
        style={{ color: "white", backgroundColor: "green", border: 0 }}
        type="button"
        onClick={onApprove}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={onReject}
        style={{
          marginLeft: "10px",
          color: "white",
          backgroundColor: "red",
          border: 0,
        }}
      >
        Reject
      </button>
    </div>
  );
};

export default ApprovalButtons;
