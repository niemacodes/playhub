import React from 'react';
import NavBar from './NavBar';
import '../App.css'
import Profile from './Profile'
import { useQuery, gql } from "@apollo/client";

const recommendProfiles = gql`
  query RecommendedProfiles {
    recommendedProfiles {
          id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
          followNftAddress
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
          type
          }
          ... on RevertFollowModuleSettings {
          type
          }
        }
    }
  }
`;

export default function Home() {
  const {loading, error, data} = useQuery(recommendProfiles);

  if (loading) return 'Loading..';
  if (error) return `Error! ${error.message}`;

  return (
    <>
        <NavBar></NavBar>
        <div id="main-content" className="h-full bg-gray-50 relative overflow-y-auto lg:ml-64">
        <main>
        <div>
          {data.recommendedProfiles.map((profile, index) => {
            console.log(`Profile ${index}:`, profile);
            return (
              <div>
                <Profile key={profile.id} profile={profile} displayFullProfile={false} />
              </div>
            );
          })}
        </div>
        </main>
        </div>
    </>
  );

//   <div>
//   {data.recommendedProfilesQuery.map((profile, index) => {
//     console.log(`Profile ${index}:`, profile);
//     return <Profile key={profile.id} profile={profile} displayFullProfile={false} />;
//   })}
// </div>
}