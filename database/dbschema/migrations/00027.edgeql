CREATE MIGRATION m15hmjmnsh2sbf6iyxuyqiuiu55bbduxiioy3ctb2tu2wg2qauxpla
    ONTO m1i53tog3rfwgmz4zzqiot6dvxzne5wywhays7iurvuh5m3ursreyq
{
  ALTER TYPE default::User {
      ALTER LINK pendingFriendsRequests {
          RENAME TO pendingFriendRequests;
      };
  };
};
