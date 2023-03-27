import Link from "next/link";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Example({ messages }) {
  const [messageGroups, setMessageGroups] = useState([]);

  const formatDate = (date) => {
    let dateDiff = moment(date).diff(moment(), "days");
    if (dateDiff == 0) {
      return "Today";
    } else if (dateDiff == 1) {
      return "Yesterday";
    } else {
      return moment(date).format("ddd, MMM DD");
    }
  };

  useEffect(() => {
    let unsortedMessages = messages;
    let sortedMessages = messages.sort(
      (a, b) => moment(b.attributes.createdAt) - moment(a.attributes.createdAt)
    );

    let groupMessagesByDay = sortedMessages.reduce((r, a) => {
      r[moment(a.attributes.createdAt).format("YYYY-MM-DD")] = [
        ...(r[moment(a.attributes.createdAt).format("YYYY-MM-DD")] || []),
        a,
      ];
      return r;
    }, {});

    let groupMessagesByDayArray = Object.keys(groupMessagesByDay).map((key) => {
      return { date: key, messages: groupMessagesByDay[key] };
    });

    setMessageGroups(groupMessagesByDayArray);
  }, [messages]);

  return (
    <div className="bg-white rounded-3xl">
      <div className="p-6 border-b border-indigo-100">
        <h3 className="text-3xl">All Updates</h3>
      </div>
      <div className="space-y-2 mt-4 p-6">
        {messageGroups.map((messageGroup, index) => {
          return (
            <div key={index}>
              <p className="text-indigo-500">
                {formatDate(messageGroup.date)}{" "}
              </p>
              <hr />
              <div className="space-y-2 mt-2">
                {messageGroup.messages.map((message, index) => {
                  return (
                    <div
                      key={message.id}
                      className="flex flex-col bg-white rounded-lg py-3"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-base text-gray-700">
                          <span className="font-bold capitalize">
                            {
                              message.attributes?.profile?.data?.attributes
                                ?.name
                            }
                          </span>{" "}
                        </p>
                        <p className="text-xs font-medium text-gray-500 capitalize">
                          {moment(message.attributes?.createdAt).format(
                            "hh:mm a"
                          )}
                        </p>
                      </div>

                      <p className="text-base text-gray-600">
                        Commented in{" "}
                        <Link
                          href={`campaigns/${message.attributes?.campaign?.data?.id}`}
                        >
                          <span className="font-bold underline cursor-pointer capitalize">
                            {
                              message.attributes?.campaign?.data?.attributes
                                ?.name
                            }
                          </span>
                        </Link>
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-700 border-l pl-4 break-words">
                        {`"${message.attributes?.text}"`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* {messages.map((message, index) => {
                return (
                  <div key={index} className="flex flex-col bg-white rounded-lg px-4 py-3 border">
                    <p className="text-lg text-gray-900"><span className="font-bold capitalize">{message.attributes?.profile?.data?.attributes?.name}</span> commented in <Link href={`campaigns/${message.attributes?.campaign?.data?.id}`}>
                      <span className="font-bold capitalize underline cursor-pointer">{message.attributes?.campaign?.data?.attributes?.name}</span>
                      </Link>

                    </p>
                    <p className="text-md font-medium text-gray-500 capitalize">{moment(message.attributes?.createdAt).format("MMMM D, hh:mm a")}</p>
                    <p className="mt-2 text-lg font-medium text-gray-900 capitalize">{message.attributes?.text}</p>
                  </div>
                )
              })} */}
      </div>
    </div>
  );
}
