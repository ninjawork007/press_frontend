import Tooltip from "./tooltip";
import StatusLabel from "./statusLabel";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { InformationCircleIcon, CalendarIcon } from "@heroicons/react/outline";

const IsDoFollowLabel = ({ isDoFollow, doFollowLinksAllowed }) => {
  let content;
  if (isDoFollow) {
    content = (
      <>
        <p>The article will be indexed and ranked on search engines</p>
      </>
    );
    if (doFollowLinksAllowed) {
      content = (
        <>
          <p>
            The article will be indexed and ranked on search engines
            <br />
            <br />
            Links Allowed: <b>{doFollowLinksAllowed}</b>
          </p>
        </>
      );
    }
  } else {
    content =
      "The publication is not indexed and will not be ranked on search engines";
  }

  const title = isDoFollow ? "Do Follow" : "No Follow";

  return (
    <Tooltip content={content}>
      <StatusLabel title={title} status={isDoFollow ? 0 : 3} />
    </Tooltip>
  );
};

const ImageLabel = ({ imageRequired }) => {
  var message;
  var title;
  var status = 3;

  if (imageRequired == "Y") {
    title = "Image Required";
    message = "Image are required for this publication";
    status = 0;
  } else if (imageRequired == "N") {
    title = "Image Not Required";
    message = "Image are not required for this publication";
    status = 4;
  } else if (imageRequired == "YN") {
    title = "Image May Be Required";
    message = "Image may be required for this publication";
    status = 2;
  }

  return (
    <Tooltip content={message}>
      <StatusLabel title={title} status={status} />
    </Tooltip>
  );
};

const SponsorLabel = ({ isSponsored }) => {
  var message;
  var title;
  var status = 3;

  if (isSponsored == "Y") {
    title = "Sponsored";
    message =
      "Sponsored articles may mention sponsored, paid post, or something similar";
  } else if (isSponsored == "N (Disclaimer)") {
    title = "Non-sponsored*";
    message =
      "articles will have no sponsored disclaimers, but in some cases may contain ‘Presented by writers name’ or something similar";
    status = 2;
  } else if (isSponsored == "N") {
    title = "Non-Sponsored";
    message =
      "Non-sponsored articles will have no sponsored disclaimers, but in some cases may contain ‘Written in partnership with Writer’s Name’, ‘Presented by Writer’s Name’ or something similar";
    status = 0;
  } else if (isSponsored == "YN") {
    // title = "Non-Sponsored"
    // message = "Non-sponsored articles will have no sponsored disclaimers, but in some cases may contain ‘Written in partnership with Writer’s Name’, ‘Presented by Writer’s Name’ or something similar"
  }

  return (
    <Tooltip content={message}>
      <StatusLabel title={title} status={status} />
    </Tooltip>
  );
};

const NewsLabel = ({ news }) => {
  var message;
  var title;
  var status;
  if (news == "Y") {
    title = "Google News";
    message = "Your page will show in Google news results";
    status = 0;
  } else if (news == "M") {
    title = "Google News";
    message = "Your page may or may not show in Google news results";
    status = 2;
  } else if (news == "N") {
    title = "No Google News";
    message = "Your page will not show in Google news results";
    status = 3;
  }

  return (
    <Tooltip content={message}>
      <StatusLabel title={title} status={status} />
    </Tooltip>
  );
};

const IndexLabel = ({ indexed }) => {
  var message;
  var title;
  var status;
  if (indexed == "Y") {
    title = "Indexed";
    message = "Your page will show in search results.";
    status = 0;
  } else if (indexed == "M") {
    title = "Indexed*";
    message = "Your page may or may not show in search results";
    status = 2;
  } else if (indexed == "N") {
    title = "Not Indexed";
    message = "Your page will not show in search results";
    status = 3;
  }

  return (
    <Tooltip content={message}>
      <StatusLabel title={title} status={status} />
    </Tooltip>
  );
};

const TurnaroundTimeLabel = ({ turnaroundTime }) => {
  return (
    <span className="flex lg:flex gap-1 items-center">
      <div className="flex items-center gap-1">
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        Turnaround time
      </div>{" "}
      <Tooltip content="The estimated time after you approve the article before it is published and live">
        <span className="flex items-center gap-1">
          <b>~{turnaroundTime}</b>
          <InformationCircleIcon className="h-4 w-4" />
        </span>
      </Tooltip>
    </span>
  );
};

module.exports = {
  IsDoFollowLabel,
  ImageLabel,
  SponsorLabel,
  NewsLabel,
  IndexLabel,
  TurnaroundTimeLabel,
};
