(function(){
    let countSpan=document.querySelector(".count span");
    let bulletsContainer=document.querySelector(".bullets .spans");
    let quizArea=document.querySelector(".quiz-area");
    let answersArea=document.querySelector(".answers-area");
    let submitButton=document.querySelector(".submit-button");
    let countDownElement=document.querySelector(".count-down");
    let currentQuestions=0;
    let questionsNumber;
    let rightAnswers=0;
    let intervalId;
    //get Data From Json Object
    function getQuestions()
    {
        let myRequest= new XMLHttpRequest();
        myRequest.open("GET","htmlQustions.json",true);
        myRequest.send();

        myRequest.onreadystatechange=function(e)
        {
            if(this.readyState === 4 && this.status === 200)
            {
              let  data= JSON.parse( this.responseText);
                 questionsNumber=data.length;
                getData(data[currentQuestions],4)
                CreateBullets(questionsNumber);
                countDown(120,questionsNumber);

                submitButton.onclick=function()
                {
                    //Get Right Answer
                    if(currentQuestions!== questionsNumber)
                    {
                      
                    let rightAnswer=data[currentQuestions]["right_answer"];

                    currentQuestions++;
                    handleSpanActive(currentQuestions,questionsNumber);
                    //check Ansewer
                    checkAnswer(rightAnswer,questionsNumber);
                    answersArea.innerHTML='';
                    quizArea.innerHTML='';
                getData(data[currentQuestions],questionsNumber)
                showResult(rightAnswers,questionsNumber);
                clearInterval(intervalId);
                countDown(120,questionsNumber);
                       
                    }
                }
             
                
            }
        }
    }

  
    //Create bullets For Number Of Questions
    function CreateBullets(num)
    {
        countSpan.innerHTML=num;

        //create span 
        for(var i=0;i<num;i++)
        {
            let span=document.createElement("span");

            bulletsContainer.appendChild(span);

        }
        let spans=document.querySelectorAll(".bullets span");
        spans[currentQuestions].classList.add("on")
    }

    function getData(obj,count)
    {
       if(currentQuestions<count)
       {
         //create  quiz title 
         let title=document.createElement("h2");
         title.className="title";
         
         title.innerText=obj['title'];
         quizArea.appendChild(title);
 
         //create answer div 
 
         for(let i=0;i<4;i++)
         {
             
         let answer=document.createElement("div");
 
         answer.className="answer";
            
         let radioInput=document.createElement("input");
         radioInput.type="radio";
         radioInput.id=`answer_${i+1}`;
         radioInput.name="question";
         radioInput.dataset.answer=obj[`answer_${i+1}`];
         //create label 
         let label=document.createElement("label");
         label.htmlFor=`answer_${i+1}`;
         label.innerHTML=obj[`answer_${i+1}`];
         if(i==0)
         {
            radioInput.checked=true;
         }

         answer.appendChild(radioInput);
         answer.appendChild(label);
          answersArea.appendChild(answer);
         
         }
       }
    }
    
    function checkAnswer(rAnswer,count)
    {
        let radio=document.querySelectorAll('.answers-area input');
        let choosenAnswer;
        radio.forEach(r=>{
            if(r.checked)
            {   
                choosenAnswer=r.dataset.answer;
            }
        });

        if(rAnswer == choosenAnswer)
        {
            rightAnswers++;
        }
    }
    function handleSpanActive(current,count)
    {
        let bullets =document.querySelectorAll('.bullets .spans span');
        if(current<count)
        {
        bullets[current].className="on";
        }   

    }
    function showResult(rAnswers,count)
    {
        //create span
        if(currentQuestions ===count) {
            answersArea.remove();
            quizArea.remove();
            bulletsContainer.remove();
            submitButton.remove();
            countDownElement.remove();
        let spanResult=document.createElement("span");
        console.log(count);
        if(rAnswers >5 && rAnswers<count)
        {
            spanResult.className="good";
            spanResult.innerHTML=`Good You Answerd ${rAnswers} From ${count} `;
        }else if (rAnswers <5 )
        {
            spanResult.className="bad";

            spanResult.innerHTML=`Bad You Answerd ${rAnswers} From ${count} `;

        }else if(rAnswers ===count) {
            spanResult.className="perfect";
            console.log(rAnswers);
            spanResult.innerHTML=`Perfect You Answerd ${rAnswers} From ${count} `;

        }
        document.querySelector(".results").appendChild(spanResult);
        }
    }
    function countDown(duration,count)
    {
        if(currentQuestions < count)
        {
            let minutes;
            let seconds;
            intervalId= setInterval(function(){
                minutes=parseInt(duration / 60);
                seconds=parseInt(duration % 60);

                minutes= minutes <10 ? `0${minutes}`:minutes;
                seconds= seconds <10 ? `0${seconds}`:seconds;

                countDownElement.innerHTML= `<span>${minutes}:${seconds}`

                if(--duration<0)
                {
                    clearInterval(intervalId);
                    submitButton.click();
                }
            },1000);

        }

    }
    getQuestions();
    
}());