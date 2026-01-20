import React from "react";
import PropTypes from 'prop-types';

function ErrorMsg(props) {
    return (
        <div className="alert alert-danger" role="alert">
            {props.msg}
        </div>
    );
}

ErrorMsg.propTypes = {
    msg: PropTypes.string.isRequired
};

export { ErrorMsg };