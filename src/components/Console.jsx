const Console = ( {information} ) => {
    return (
        <div className="flex flex-col flex-1">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'console' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('console')}
                >
                    Console
                </button>
                <button
                    className={`tab ${activeTab === 'rocket' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('rocket')}
                >
                    Rocket
                </button>
            </div>

            {activeTab === 'console' && (
                <div className="console-tab">
                    <div className="divider uppercase">Console</div>
                    <textarea
                        className="grow-[1] resize-none textarea textarea-bordered"
                        readOnly={true}
                        value={information}
                    ></textarea>
                </div>
            )}

            {activeTab === 'rocket' && (
                <div className="rocket-tab">
                    <div className="divider uppercase">Rocket Orientation</div>
                    <div className="rocket-container">
                        {renderRocket(calculatedOrientation)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Console;