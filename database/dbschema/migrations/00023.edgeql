CREATE MIGRATION m1mo2e3dtxr7wrupijrnqv6kebgj7f7rmexeghmckdejgioaphakba
    ONTO m1s2lhthbc67eb43spe3uwou4j7v7sm5we3t3n7bztzgzpyh7azccq
{
  ALTER TYPE default::Notification {
      ALTER LINK object {
          ON TARGET DELETE ALLOW;
          SET MULTI;
      };
  };
};
