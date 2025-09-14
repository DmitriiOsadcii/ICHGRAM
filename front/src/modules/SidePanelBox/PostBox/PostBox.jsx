import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "../../../shared/components/LoaderComponent/Loader";
import Error from "../../../shared/components/ErrorComponent/Error";
import PostModal from "../../Modals/PostModal/PostModal";

import { getPostByIdApi } from "../../../shared/api/post.api";

function PostOverlay() {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const data = await getPostByIdApi(id);
        setPostData(data);
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Unknown error";
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <Loader loading={true} />;
  if (errorMsg) return <Error>{errorMsg}</Error>;
  if (!postData) return null;

  return <PostModal post={postData} />;
}

export default PostOverlay;