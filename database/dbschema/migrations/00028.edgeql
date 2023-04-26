CREATE MIGRATION m1b6vte77nyn5ucro7cz6er374bcep7emhz7sjdt73jx2byc4vduca
    ONTO m15hmjmnsh2sbf6iyxuyqiuiu55bbduxiioy3ctb2tu2wg2qauxpla
{
  ALTER TYPE default::User {
      ALTER LINK pendingFriendRequests {
          RENAME TO pendingFriendsRequests;
      };
  };
};
