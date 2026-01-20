import React from "react";

export function Loading() {
    return (
        <div className="spinner-border spinner-border-sm text-light" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
}