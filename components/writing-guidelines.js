/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

export default function Example({open, setOpen}) {

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
        
                  <div className="mt-3 sm:mt-5">
                  <div className="lqd-column col-md-8 col-md-offset-2">


                  <h2 className="text-3xl">Writing Guidelines</h2>



              <p className="text-left">Articles should be in Press Release format and follow these guidelines:</p>
              
              <div id="ld-tab-pane-writing-guidelines-PNN" role="tabpanel" className="tabs-pane fade active in">
                <ul className="text-left list-disc pl-5 py-4">
                  <li>The article needs to be between 350 to 800 words.</li>
                  <li>The headline must summarize the article in a single sentence.</li>
                  <li>The article should sound like a news story, not a sales letter.</li>
                  <li>Only use personal pronouns (I, me, we, our, us, you, your, etc.) in quotes.</li>
                  <li>The article must not include questions directed at the reader.</li>
                  <li>You may include up to 3 links.</li>
                  <li>You may include up to 6 images.</li>
                  <li>The article needs to be in English, containing only English letters.</li>
                </ul>
              </div>
              <p>
                <a href="https://docs.google.com/document/d/1qeoVv492fBS2dthh4QnCe3PN_fq9O_Jp2KMo5WvAKrs/edit?usp=sharing" target="_blank" rel='noreferrer' className="font-bold"><i className="fas fa-cloud-download-alt mr-1"></i> View our Press Release Template</a>.
              </p>
            </div>
          
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

