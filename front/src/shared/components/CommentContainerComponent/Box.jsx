import { useRef, useCallback } from "react";

import CommentContainer from "./CommentContainerComponent";

import styles from "./Box.module.css";

function CommentsBox({ comments, hasMore, loading, onLoadMore }) {
  const ioRef = useRef(null);

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (ioRef.current) ioRef.current.disconnect();

      ioRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) onLoadMore();
      });

      if (node) ioRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  const items = comments.map((item, index) => {
    const isLast = index === comments.length - 1;
    return (
      <CommentContainer
        ref={isLast ? lastRowRef : undefined}
        key={item._id}
        comment={item}
      />
    );
  });

  return <ul className={styles.cmtList}>{items}</ul>;
}

export default CommentsBox;