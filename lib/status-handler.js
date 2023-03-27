import StatusLabel from "../components/statusLabel";

class StatusHandler {
  constructor() {
    this.status = "OK";
  }

  renderStatus(status, isManager) {
    const pressTeamReviewing = (status) => status == "reviewing";
    const requiresClientAction = (status) => status == "requires-action";
    const articleIsPubilshed = (status) => status == "completed";
    const awaitingPublishing = (status) => status == "publishing";
    const articleIsRejected = (status) => status == "rejected";
    const publicationCanceled = (status) => status == "canceled";

    if (pressTeamReviewing(status)) {
      return (
        <StatusLabel
          title={isManager ? "ACTION REQUIRED" : "PENDING REVIEW"}
          status={isManager ? 2 : 1}
        />
      );
    } else if (requiresClientAction(status)) {
      return (
        <StatusLabel
          title={isManager ? "PENDING CLIENT REVIEW" : "ACTION REQUIRED"}
          status={isManager ? 1 : 2}
        />
      );
    } else if (articleIsPubilshed(status)) {
      return <StatusLabel title={"COMPLETED"} status={0} />;
    } else if (articleIsRejected(status)) {
      return <StatusLabel title={"REJECTED"} status={4} />;
    } else if (awaitingPublishing(status)) {
      return <StatusLabel title={"PENDING PUBLISHING"} status={5} />;
    } else if (publicationCanceled(status)) {
      return <StatusLabel title={"CANCELED"} status={4} />;
    } else {
      return <StatusLabel title={"PENDING"} status={1} />;
    }
  }
}

export default new StatusHandler();
