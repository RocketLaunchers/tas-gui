const Console = ( {information} ) => {
    return (
        <div className='flex flex-col flex-1'>
            <div className="divider uppercase">Console</div>
            <textarea className="grow-[1] resize-none textarea textarea-bordered" readOnly={true} value={information}></textarea>
        </div>
    );
}

export default Console;
