import React, { useState } from 'react';
import { MessageCirclePlus, UsersRound, Menu, ChevronRight, Search, MessageSquare, MoreVertical, Check } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const AddFriendpage = () => {
    const [sent, setSent] = useState(false);
    const [shake, setShake] = useState(false);
    const [username, setUsername] = useState('');
    const handleSend = () => {
        if (!username.trim()) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
        setSent(true);
    };
    return (
        <div>
            <div className=" w-full bg-[#31333813] flex items-start justify-center p-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full max-w-2xl"
                >
                    {/* Header row */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="flex items-start justify-between"
                    >
                        <div>
                            <h1 className="text-white text-xl font-semibold">Add Friend</h1>
                            <p className="text-[#b5bac1] text-sm mt-1">
                                You can add friends with their Discord username.
                            </p>
                        </div>

                        {/* Mascot */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.4, delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                            className="relative shrink-0 -mt-2 animate-[float_3s_ease-in-out_infinite]"
                        >
                            <svg className="w-26 h-26" viewBox="0 0 1000 1000" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M683.699 55.2847C691.017 45.5852 704.812 43.6544 714.511 50.9721C724.21 58.2899 726.141 72.085 718.824 81.7842L682.651 129.729C746.166 126.632 804.645 160.709 834.243 214.63C831.549 212.717 828.915 211.891 826.399 212.289C810.035 214.882 804.893 268.278 814.915 331.554C824.937 394.829 846.328 444.023 862.692 441.433C863.869 441.246 864.987 440.795 866.045 440.099C853.489 488.819 818.856 529.884 771.796 550.013C763.496 557.73 734.383 586.087 730.001 608C724.883 633.602 757.001 672 757.001 672C756.919 671.981 658.907 648.425 617 623C584.816 603.474 531.093 597.941 510.192 596.485L323.931 625.986C257.625 636.487 194.313 605.674 160.214 552.596C160.623 552.595 161.029 552.565 161.433 552.501C177.797 549.909 182.938 496.512 172.917 433.236C162.895 369.96 141.504 320.766 125.14 323.358C123.604 323.601 122.167 324.29 120.832 325.394C133.307 264.562 179.901 214.207 242.71 198.976L195.178 165.734C185.222 158.771 182.795 145.054 189.758 135.097C196.722 125.14 210.438 122.714 220.395 129.677L304.668 188.614L322.148 185.846C325.746 175.326 334.898 167.095 346.644 165.235L555.135 132.213C566.88 130.353 578.128 135.352 584.8 144.246L620.896 138.529L683.699 55.2847ZM302.824 569.495C293.278 571.008 286.765 579.972 288.277 589.517C289.79 599.062 298.754 605.576 308.299 604.064L418.92 586.544C428.465 585.031 434.979 576.067 433.468 566.521C431.956 556.976 422.991 550.463 413.445 551.975L302.824 569.495ZM622.835 518.811C613.289 520.323 606.776 529.287 608.288 538.833C609.801 548.378 618.765 554.891 628.31 553.38L738.931 535.859C748.476 534.347 754.989 525.382 753.478 515.837C751.966 506.291 743.002 499.778 733.456 501.29L622.835 518.811ZM430.559 567.361C430.561 567.379 430.562 567.398 430.565 567.416C430.547 567.275 430.527 567.133 430.504 566.991L430.559 567.361ZM750.38 515.571C750.431 515.813 750.476 516.058 750.515 516.305L750.514 516.305C750.475 516.059 750.431 515.814 750.38 515.572L750.38 515.571ZM414.284 554.883C414.162 554.899 414.038 554.918 413.914 554.938L303.293 572.458C303.108 572.488 302.924 572.521 302.741 572.557C302.924 572.521 303.108 572.487 303.293 572.457L413.914 554.937L414.284 554.883ZM277.803 270.829C227.073 278.864 192.462 326.503 200.496 377.232L214.888 468.1C222.924 518.829 270.562 553.441 321.292 545.406L701.552 485.179C752.281 477.144 786.892 429.505 778.858 378.776L764.466 287.908C756.432 237.179 708.793 202.568 658.063 210.602L277.803 270.829ZM123.691 339.786C137.874 337.54 156.375 379.94 165.014 434.488C173.654 489.036 169.16 535.078 154.978 537.324C140.795 539.569 122.294 497.17 113.655 442.623C105.015 388.075 109.509 342.034 123.691 339.786ZM832.852 227.466C847.035 225.221 865.536 267.62 874.176 322.168C882.815 376.715 878.321 422.757 864.139 425.004C849.957 427.249 831.455 384.85 822.816 330.302C814.176 275.755 818.67 229.714 832.852 227.466ZM403.615 326.903C419.979 324.311 435.347 335.476 437.939 351.84L450.258 429.623C452.85 445.987 441.685 461.354 425.321 463.946C408.956 466.538 393.589 455.373 390.997 439.009L378.677 361.226C376.086 344.862 387.251 329.495 403.615 326.903ZM549.385 303.815C565.749 301.223 581.116 312.388 583.709 328.752L596.028 406.535C598.62 422.899 587.455 438.267 571.09 440.859C554.726 443.45 539.359 432.285 536.767 415.921L524.447 338.139C521.856 321.774 533.021 306.407 549.385 303.815ZM356.722 175.698C340.28 178.302 329.063 193.742 331.667 210.184C334.271 226.625 349.711 237.843 366.152 235.239L566.043 203.579C578.043 201.679 586.231 190.409 584.33 178.409L581.783 162.326C581.68 161.677 581.549 161.039 581.393 160.413C581.283 159.974 581.161 159.54 581.026 159.113C580.901 158.719 580.767 158.331 580.622 157.948C580.604 157.901 580.585 157.854 580.567 157.807C580.435 157.467 580.295 157.13 580.147 156.799C579.968 156.397 579.777 156.001 579.576 155.613C579.103 154.705 578.571 153.837 577.984 153.014C577.85 152.825 577.713 152.637 577.572 152.453C577.077 151.803 576.547 151.183 575.986 150.594C575.837 150.439 575.687 150.286 575.534 150.135C574.824 149.433 574.067 148.78 573.27 148.181C572.919 147.917 572.56 147.663 572.193 147.421C571.863 147.202 571.526 146.992 571.184 146.791L570.649 146.487C566.519 144.214 561.63 143.244 556.613 144.038L356.722 175.698ZM714.263 61.0984C710.075 57.9386 704.118 58.7723 700.958 62.9606L647.075 134.382L664.784 131.578C667.824 131.096 670.859 130.702 673.884 130.392L716.125 74.4036C719.285 70.2154 718.451 64.2585 714.263 61.0984ZM208.673 144.875C204.374 141.868 198.451 142.916 195.444 147.215C192.437 151.515 193.485 157.438 197.784 160.445L250.47 197.291C252.261 196.947 254.065 196.629 255.881 196.341L277.393 192.934L208.673 144.875Z" fill="#5865F2" />
                            </svg>
                        </motion.div>
                    </motion.div>

                    {/* Input row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className={`mt-4 flex items-center gap-3 bg-[#1e1f228e] rounded-2xl px-4 py-1.5 border border border-[#5865f25d]  focus-within:border-[#5865F2] transition-colors ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""
                            }`}
                    >
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Enter a username"
                            className="flex-1 bg-transparent text-white placeholder-[#6d6f78] text-sm py-3 outline-none"
                        />
                        <motion.button
                            onClick={handleSend}
                            whileHover={{ scale: sent ? 1 : 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            animate={sent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`shrink-0 text-white text-sm font-medium px-4 py-2 rounded-[6px] transition-colors duration-150 flex items-center gap-1.5 ${sent
                                ? "bg-[#23a55a]"
                                : "bg-[#5865F2] hover:bg-[#4752c4]"
                                }`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {sent ? (
                                    <motion.span
                                        key="sent"
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check size={14} />
                                        Friend Request Sent
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="send"
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        Send Friend Request
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>

                    <div className="h-px bg-[#3f4147] my-6" />

                    {/* Other places section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <h2 className="text-white text-base font-semibold">
                            Other Places to Make Friends
                        </h2>
                        <p className="text-[#b5bac1] text-sm mt-1 leading-relaxed">
                            Don't have a username on hand? Check out our list of public
                            servers that includes everything from gaming to cooking, music,
                            anime and more.
                        </p>

                        <motion.button
                            whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="group mt-4 w-full max-w-sm flex items-center justify-between gap-3 bg-[#2b2d3173] hover:bg-[#2f3031cb] border border-[#3f4147] rounded-2xl px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#23a55a] flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                                        <path
                                            d="M15.5 8.5L13 13L8.5 15.5L11 11L15.5 8.5Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium text-left">
                                    Explore Discoverable Servers
                                </span>
                            </div>
                            <ChevronRight
                                size={18}
                                className="text-[#b5bac1] group-hover:translate-x-0.5 transition-transform shrink-0"
                            />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default AddFriendpage