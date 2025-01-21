import { IoSearchOutline } from 'react-icons/io5';

export const HeaderModal = () => {
  return (
    <>
      <div className="form-control">
        <button
          className="btn btn-sm btn-outline btn-accent tracking-widest"
          onClick={() => {
            (
              document.getElementById('nav_modal') as HTMLDialogElement
            )?.showModal();
          }}
        >
          <IoSearchOutline className="text-black" />
        </button>
      </div>

      <dialog id="nav_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </>
  );
};
