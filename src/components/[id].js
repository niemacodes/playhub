// pages/profile/[id].js

import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import fetchProfileQuery from "./fetchProfileQuery.js";
import Post from "./Post.js";
import Profile from "./Profile.js";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  console.log("fetching profile for", id);
  const { loading, error, data } = useQuery(fetchProfileQuery, {
    variables: {
      request: { profileId: id },
      publicationsRequest: {
        profileId: id,
        publicationTypes: ["POST"], // We really only want POSTs
      },
    },
  });

  if (loading) return "Loading..";
  if (error) return `Error! ${error.message}`;

  console.log("on profile page data: ", data);

  return (
    <div className="flex flex-col p-8 items-center">
      <Profile profile={data.profile} displayFullProfile={true} />
      {data.publications.items.map((post, idx) => {
        return <Post key={idx} post={post}/>;
      })}
    </div>
  );}