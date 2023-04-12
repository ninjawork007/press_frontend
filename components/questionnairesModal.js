import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XIcon, DownloadIcon } from "@heroicons/react/outline";
import API from "@/lib/api";
import QuestionnaireModel from "@/lib/models/questionnaire-model";
import { downloadURI } from "@/lib/utils/generalUtils";

const tabs = [{ name: "Business" }, { name: "Indivudal" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QuestionnairesModal({ isOpen, setIsOpen }) {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      API.questionnaires.findAll().then((res) => {
        let questionnaireModels = res.data.data.map((questionnaireModel) => {
          return new QuestionnaireModel(questionnaireModel);
        });

        setQuestionnaires(questionnaireModels);
      });
    };
    fetchQuestionnaires();
  }, []);

  useEffect(() => {
    if (currentTab.name === "Business") {
      setFilteredQuestionnaires(
        questionnaires.filter((questionnaire) => {
          return questionnaire.type === "business";
        })
      );
    } else {
      setFilteredQuestionnaires(
        questionnaires.filter((questionnaire) => {
          return questionnaire.type === "individual";
        })
      );
    }
  }, [currentTab, questionnaires]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-3xl font-semibold text-gray-900">
                          Questionnaires
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="px-6">
                        <nav
                          className="-mb-px flex space-x-6"
                          x-descriptions="Tab component"
                        >
                          {tabs.map((tab) => (
                            <a
                              key={tab.name}
                              onClick={() => setCurrentTab(tab)}
                              className={classNames(
                                currentTab === tab
                                  ? "border-indigo-500 text-indigo-600"
                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                              )}
                            >
                              {tab.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <ul
                      role="list"
                      className="flex-1 divide-y divide-gray-200 overflow-y-auto"
                    >
                      {filteredQuestionnaires.map((questionnaire) => (
                        <li key={questionnaire.id}>
                          <div className="group relative flex items-center px-5 py-6">
                            <div className="block flex-1 py-4 px-2 border border-indigo-200 rounded-lg">
                              <div className="relative flex justify-between min-w-0 flex-1 items-center ">
                                {/* <span className="relative inline-block flex-shrink-0">
                                 <img
                                    className="h-10 w-10 rounded-full"
                                    src={person.imageUrl}
                                    alt=""
                                  />
                                </span> */}
                                <div className="ml-4 ">
                                  <p className=" text-lg text-gray-900 font-bold">
                                    {questionnaire.name}
                                  </p>
                                  <p className=" text-sm text-gray-500">
                                    {questionnaire.description}
                                  </p>
                                </div>
                                <a
                                  className="bg-indigo-200 p-2 rounded-full cursor-pointer"
                                  onClick={() =>
                                    downloadURI(
                                      questionnaire.file?.attributes.url,
                                      questionnaire.name
                                    )
                                  }
                                >
                                  <DownloadIcon
                                    className="h-6 w-6 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
