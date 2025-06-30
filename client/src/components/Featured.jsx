import React from 'react'

const Featured = () => {
  return (
    <>
      <div className="relative flex flex-col justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/TEM_background.jpg')] bg-cover bg-center min-h-screen">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center md:text-left">
          <h1 className="text-4xl md:text-[70px] font-semibold max-w-3xl pt-20 md:pt-0 leading-tight">
            TRACK EVERY MOMENT
          </h1>
          <p className="text-md md:text-lg max-w-2xl mx-auto md:mx-0 pt-5">
            Track Every Moment is your personal productivity companion where you can effortlessly track daily activities,
            create and manage tasks, and monitor your progress each day. Stay on top of your goals by viewing how many tasks
            you've completed on a given day and analyze your performance through a 15-day graph showing the time you've devoted to your tasks.
            By gaining these insights, you can improve your efficiency, manage time more effectively,
            and build better habits for a productive lifestyle.
          </p>
        </div>
      </div>
      <h1 className='text-xl text-center font-semibold mt-10 mb-5'>✅ Add Your First Task like this ...</h1>
      <div className='border-1 border-white'>
        <img src="/addtask.png" alt="" className="" />
      </div>
      <h1 className='text-xl text-center font-semibold mt-10 mb-5'>✅ Add Your Work like this ...</h1>
      <div className='border-1 border-white'>
        <img src="/addwork.png" alt="" className="" />
      </div>
      <h1 className='text-xl text-center font-semibold mt-10 mb-5'>✅ Check your daily stats ...</h1>
      <div className='border-1 border-white'>
        <img src="/dailystats.png" alt="" className="" />
      </div>
      <h1 className='text-xl text-center font-semibold mt-10 mb-5'>✅ View Your Performance like this ...</h1>
      <div className='border-1 border-white'>
        <img src="/performance.png" alt="" className="" />
      </div>
    </>


  )
}

export default Featured