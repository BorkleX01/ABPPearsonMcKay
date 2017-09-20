const React = require('react');
const ReactDOM = require('react-dom');
const queryString = require('query-string');
const debug = true;



var currentPage = 0;
var currentPageModal = 0;
var parsed = queryString.parse(location.search);

var currentPageIsMChoice = false;
var nextPageIsMChoice = false;
var destinations = [];

for (var i = 0; i < chapter.length; i++){
    if ((chapter[i].data["mode"] == "cCase")||(chapter[i].data["mode"] == "cCoach")){destinations.push(i)}
}

if(parsed.part){
    currentPage = destinations[parsed.part-1]
}




var data = chapter[currentPage].data;

function detectQuiz(){
    if (currentPage<chapter.length-1) {
        if (chapter[currentPage].data["mode"] == "mChoice"){
            currentPageIsMChoice = true;
        }else {currentPageIsMChoice = false;}

        if (chapter[currentPage+1].data["mode"] == "mChoice"){
            nextPageIsMChoice = true;
            console.log("next pagae is mChoice");
        }else {nextPageIsMChoice = false;}
    }
}
detectQuiz();

var docLoc = document.location.pathname;

//Don't forget to turn this back on
if(!debug){jQuery.noConflict(true)}



//console logs here will screw around with iOS Chrome.
function page(dir){
    if (dir == "left"){
        if(currentPage>0){currentPage--};
        data = chapter[currentPage].data;
        $('#abpApp').empty();
        detectQuiz();
        ReactDOM.render(<App/>, document.getElementById('abpApp'));
        $('.title').focus();
    }else{
        if(currentPage<chapter.length-1) {currentPage++};
        data = chapter[currentPage].data;
        $('#abpApp').empty();
        detectQuiz();
        ReactDOM.render(<App/>, document.getElementById('abpApp'));
        $('.title').focus();
    }
}
function initTranscriptBtn(){
    var transcriptToggle = false;
    $('.transcript-btn a').click(function(){
        console.log("transcript");
        if (!transcriptToggle){
            $('#video-wrapper').css('display','none');
            $('.transcript-wrapper').css('display','block');
            transcriptToggle = true;
        }else
        {
            $('#video-wrapper').css('display','block');
            $('.transcript-wrapper').css('display','none');
            transcriptToggle = false;
        }
    })
}
function iframeResizer(el, w){
    IFRAME = el;
    console.log('==========get iframeResizerxx==========');
    console.log($('.modal-dialog').width());
    console.log($('.modal-content').width());
    console.log($('.secondIframe').width());
    
    var playerBody = $($('iframe')[1]).contents().find('iframe')[0];
    //console.log('player body');
    //console.log(playerBody);
    var vidWidth = 552;
    var vidHeight = 414;
    var vidAspRatio = vidHeight / vidWidth;
    
    IFRAME.width(w+3);
    IFRAME.height(IFRAME.width()*vidAspRatio);
    $(playerBody).width(w);
    $(playerBody).height(w*vidAspRatio);


    var getHeight = function() {
        console.log('==========get height==========');
        console.log(el);
        console.log($('.secondIframe').width());
        console.log($('.secondIframe iframe').width());
        console.log($('.modal-body').width());
        
        if ($('.secondIframe').width() < 708) {
            IFRAME.width($('.secondIframe').width());
            $(playerBody).width($('.secondIframe').width()-10);
            IFRAME.height($('.secondIframe').width() * vidAspRatio);
           $(playerBody).height($('.secondIframe').width()*vidAspRatio-10);
        } else {
            IFRAME.width(710);
            IFRAME.height(524);
        }
    }
    
    $(window).resize(function() {
        getHeight()
    })

    /*IFRAME.on("load", function() {
        getHeight()
    })*/
}
function videoResizer(el){
    "use strict";
    var IFRAME, THISDOMAIN;
    var TEXTWELL;
    IFRAME = el;
    window.IFRAME = IFRAME;
    THISDOMAIN = document.location.protocol + "//" + document.location.host;
    var vidWidth = 552;
    var vidHeight = 414;
    var vidAspRatio = vidHeight / vidWidth;
    var getHeight = function() {
        if ($('#video-wrapper').width() < 708) {
            IFRAME.width($('#video-wrapper').width());
            IFRAME.height($('#video-wrapper').width() * vidAspRatio);
        } else {
            IFRAME.width(710);
            IFRAME.height(524);
        }
    }
    var iframeCallback = function(e) {
        var data = {};
        if (data = "string" == typeof e.data ? eval("(" + e.data + ")") : e.data, "undefined" == typeof data.method) return;
        switch (data.method) {
        case "getHeight":
            IFRAME.height(data.value)
        }
    };
    
    window.addEventListener("message", iframeCallback, !1);

    $(window).resize(function() {
        getHeight()
    })
    
    IFRAME.on("load", function() {
        getHeight()
    })

    
    

}

var Header = React.createClass({
    layoutOptions: function(){
        var transcriptToggle = (<div className="transcript-btn">
                    <a className="h6" href="#">Transcript</a>
                </div>)
        if (data["mode"] == "cCoach"){return transcriptToggle}else{return null}
    },
    getTitle: function(){
        var title = "";
        if ((data["mode"] == "cCase")||(data["mode"] == "mChoice")){title = "Clinical Case"}
        else if (data["mode"] == "cCoach"){title = "Concept Coach"}
            return title;
    },
    componentDidMount: function(){
        initTranscriptBtn();
    },
    
    render: function(){
        
        return (<div className="row title-bar" role="header">
                <div className="title">
                  <h1 tabIndex="0" className = "heading_major" >{this.getTitle()}</h1>
                  
                </div>
                {this.layoutOptions()}
                
                
                </div>);
    }
})

var Transcript = React.createClass({
    layoutOptions: function(){
        var single = (<div className="col-md-12 transcript-wrapper">
                      <div tabIndex="0" className="transcript well optional-text" dangerouslySetInnerHTML={{__html:data['transcript']}}></div>
                      </div>);
        var dual =   (<div className="col-md-6">
                      <div tabIndex="0" className="side-text well optional-text" dangerouslySetInnerHTML={{__html:data['transcript']}}></div>
                      </div>)
        if (data["mode"] == "cCoach"){return single}else{return dual;}
    },
    render: function(){
        return this.layoutOptions();
    }
})

var Video = React.createClass({
    
    layoutOptions: function(){
        console.log("special");
        //console.log(this.props.special);
        var single = (<div className="col-md-12" id="video-wrapper">
                      <div className="content-container">
                      <VideoEmbedder srcScript={data["video"]}/>
                      </div>
                      
                      </div>);

        var dual = (<div className="col-md-6" id="video-wrapper">
                    <div className="content-container">
                    <VideoEmbedder srcScript={data["video"]}/>
                    </div>
                    <RenderRemedButton/>
                    </div>)
        if ((data["mode"] == "cCoach") )
        {return single}
        else if ((data["mode"] == "cCase")|| (data["mode"] == "dualVideo"))
        {return dual;}

    },
    render: function(){
        return this.layoutOptions();
    }
})

var VideoEmbedder = React.createClass({
    componentDidMount: function(){
        if(typeof data["video"] !== 'undefined'){
            var vidScript = document.createElement('script');
            vidScript.setAttribute('type', 'text/javascript');
            ReactDOM.findDOMNode(this.refs['vid']).appendChild(vidScript);
                vidScript.onload = function(){
                    videoResizer($("#player-iframevideo-container"));
                };
                vidScript.setAttribute('src', this.props.srcScript);
            }else
            {
                if(typeof data['iframe'] != 'undefined'){
                    
                }
            }
            
        },
        render: function(){
            return(<div id="video-container" ref="vid"></div>)
        }
    })

var Iframe = React.createClass({
    componentDidMount: function(){
        var IFRAME = $('#iframe');
        IFRAME.on("load", function(){
            $('.remed-open').css('display','block');
            $('.remed-close').on('click', function(){
                console.log('remed close');
            });
            
            $('.remed-open').on('click', function(){
                console.log('remed-open');
                //$('.modal-dialog').width($('.main').width()-20);
                var w = $('.main').width();
                if (w > 552){w = 552};
                $('.modal-content').width(w);
                $('.secondIframe').width(w-20);
                
                console.log($('.secondIframe').width());
                iframeResizer(IFRAME, w-20);
                
            });
            console.log('iframe load');
            console.log(IFRAME);
            var frame2body = $($('iframe')[1]).contents().find('body')[0];
            console.log('iframe locate body');
            $(frame2body).css('margin','0px');
            //
        }).attr({"src":location.pathname+this.props.srcScript, "allowFullScreen":true});
    },
    render: function(){
        console.log('======render Iframe========');
        return(<div className="secondIframe"><iframe ref="iframe" src="" id="iframe" title=""></iframe></div>)
    }
})


class NavLeft extends React.Component{
    handleClick(){
        page('left');
    }
    render(){
        return(<button className="nav-btn-previous btn btn-default" onClick={this.handleClick}>
               <a className="previous" href="#" tabIndex="-1">Previous</a>
               </button>)
    }
}

class NavRight extends React.Component{
    handleClick(){
        page('right');
    }
    
    render(){
        return(<button  className="nav-btn-next btn btn-default" onClick={this.handleClick}>
               <a className="next" href="#" tabIndex="-1" >Next</a>
               </button>)
    }
}

class FriendlyQuizNotice extends React.Component{
    render(){
        if ((currentPageIsMChoice==false) && (nextPageIsMChoice)){
            return (<div className="quiz-notice">Click Next to quiz your case comprehension</div>)
        }else return null;
    }
}

var Paginator = React.createClass({
    componentDidMount: function(){

    },
    renderLeft: function(){
        if (currentPage > 0){
            return (<NavLeft/>)
        }
    },
    renderRight: function(){
        if(currentPage < chapter.length-1){
            return(<NavRight/>)
        }
    },
    render: function(){
        return(<div className="row paginator-row" ref="navBtns">
               <FriendlyQuizNotice/>
               {this.renderLeft()}
               {this.renderRight()}
               </div>)
    }
})
var QuizForm = React.createClass({
    genQuiz: function(){
        function returnVal(ind){
            if (ind == data['correctInd']){
                return 'right';
            }else{
                return 'wrong'}
        }
        function returnRadioVal(ind){
            return String('a'+Number(ind+1))
        }
        function quizItem(){
            return(
            data["quizAnswers"].map(function(a,b,c){
                return <div className="answer" key={b}>
                    <input tabIndex="0" type="radio" name="quiz_answer" id={returnRadioVal(b)} data-radioval={returnRadioVal(b)} data-anskey={b} value={returnVal(b)}  />
                    <label htmlFor={returnRadioVal(b)} data-radioval={returnRadioVal(b)} data-anskey={b}> <span className="indicator"></span><div tabIndex="0" dangerouslySetInnerHTML={{__html:a}}></div></label>
                    <div className="clearfix"></div>
                    <p className="answer-reason" role="alert" aria-live="assertive" tabIndex="0" dangerouslySetInnerHTML={{__html:data["quizResponses"][b]}}></p>
                    </div>
            }))
        };
        var quizForm = (
                <form method="post" name="lesson-quiz" className="lesson-quiz" action="" onsubmit="return false;">
                <fieldset>
                <h6 tabIndex="0" className="qa">Select Answer</h6>
                {quizItem()}
                <button type="button" className="btn btn-primary btn-submit-multichoice">Submit</button>
                </fieldset>
                </form>
        );
    return quizForm;
    },
    componentDidMount: function(){
        initQuiz();                      
    },
    render: function(){
        return this.genQuiz()
    }
})

var QuizExtras = React.createClass({
    decideRender: function(){
        if (typeof data.tables !== 'undefined')
        {
            console.log("has extras");
        }
        else
        {
            return null;
        }

        function genTables(){
            return(
                data.tables.map(function(currentVal, index, array){
                    return <img width="100%" src={location.pathname+data.tables[index]}></img>
                }))
        }
        return (<div class="quiz-tables">{genTables()}</div>)
    },
    render: function(){
        return this.decideRender()
    }
})


var RenderRemedButton = React.createClass({
    decideRender: function(){
        console.log("render remedxxx" );
        if (typeof modal !== 'undefined'){
            console.log('render modal');
            if (modal[0].data["index"] == currentPage){
                return (<div>
                        <div dangerouslySetInnerHTML={{__html:"<i>Need help with scientific notation in Mollie’s test result tables? Select the Review button below for more information.</i><br>"}}></div>
                        <button type='button' className='remed-open'  class='btn btn-info btn-lg' data-toggle='modal' data-target='#myModal'>Review</button>
                        </div>);
            }else return null;
        } else {
            console.log("no modal");
            return null;
        }
    },
    render: function(){
        return this.decideRender();
    }
})

var Main = React.createClass({
    
    returnContent: function(){
        if (typeof data["video"] != 'undefined'){
            return (<Video/>
                    )
                   
        }else if (typeof data["iframe"] != 'undefined'){
            return (<Iframe srcScript={data["iframe"]}/>)
        }
        
    },
    returnContent2: function(){
        if (data["mode"]== "dualVideo"){
            return (<Iframe srcScript={data["iframe"]}/>)
        }else{
            return (<Transcript/>)
        }
    },

    renderAssetButton: function(){
        console.log("Asset button:" + typeof hasNoAssets);
        if(typeof hasNoAssets !== 'undefined') 
        {
            console.log("Asset button no assets:" + typeof hasNoAssets);
            return
        }
        else
        {
            console.log("Asset button has asset:" + typeof hasNoAssets);
            return (<form className="contents-form" action={String("https://media.pearsoncmg.com/bc/bc_norman-mckay_micro_1/ct-booklet/chapter-"+chapterNumber+".php")}>
	            <input className=" btn btn-default contents-btn" type="submit" value={String("Chapter "+chapterNumber+" Assets")}/>
                    </form>)
        }
    },
    
    componentDidMount: function(){
    },
    layoutOptions: function(){
        
        var presentation = (<div role="main" content={data} className="main">
                      <div className="row sub-title-bar">
                          <div className="col-sm-12">
                            <h2><a href={String(location.origin + location.pathname)}>{data['section']}</a></h2>
                            {this.renderAssetButton()}
                            
                          </div>
                      </div>

                      <div className="row content">
                            {this.returnContent()}
                            
                            {this.returnContent2()}
                      </div>
                      
                      <Paginator/>
                  </div>);
        var multiChoice = (<div role="main" content={data}>
                               <div className="row sub-title-bar">
                                   <div className="col-sm-12">
                           <h2><a href={String(location.origin + location.pathname)}>{data['section']}</a></h2>
			   {this.renderAssetButton()}
                                   </div>
                               </div>

                           <div className="row">
                               <div className="col-sm-12">
                                   <div className="content">
                           <div className="question">
                           <div tabIndex="0" className="questionString">
                           <p dangerouslySetInnerHTML={{__html:data["quizQuestion"]}}></p>
                           <h6 >{data["quizHint"]}</h6>
                           </div>
                                         <QuizForm/>
                                         <QuizExtras/>
                                       </div>    
                                   </div>    
                               </div>
                               
                           </div>
                           <Paginator/>
                          </div>);


        if((data["mode"]=="cCoach") || (data["mode"]=="cCase")){
            return presentation
        } else if(data["mode"]=="mChoice"){
            return multiChoice
        }else if (data["mode"]=="dualVideo"){
            console.log('dual video');
            return presentation;
        };
    },
    render: function(){
        return this.layoutOptions();
    }
})

var Footer = React.createClass({
    render: function(){
        return (<div className="row footer-bar" role="footer">
                <div className="col-sm-12">
                <img alt="Pearson" src="assets/img/pearson-logo.png" className="pearson-logo"/>
                <img alt="Always Learning" src="assets/img/pearson-always-learning.png" className="always-learning"/>
                </div>
            </div>)
    }
})


var Modal = React.createClass({
    render: function(){
    return (<div id="myModal" className="modal fade" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close remed-close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">Remediation</h4>
        </div>
        <div className="modal-body">
          <div className="row content" >
            <Iframe srcScript={modal[0].data["iframe"]}/>
          </div>
        </div>
        <div className="modal-footer">
          <button  type="button" className="btn btn-default remed-close" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
    </div>)
    }
})


var App = React.createClass({
    modalInsert: function(){
        
        console.log('modal decision');
        
        if (typeof modal !== 'undefined'){
            console.log('modal decision true');
            if (modal[0].data["index"] == currentPage){
                console.log('render modal');
                return (<Modal/>)
            }
        }
    },
    
    render: function(){
        return (
                <div className="container">
                
                <Header/>
                <Main/>
                <Footer/>
                {this.modalInsert()}
                </div>)
    }
})

ReactDOM.render(<App/>, document.getElementById('abpApp'));



function initQuiz(){
    
    console.log("accessibility extras");

    var keyboard = true;
    var that = this;
    
    $('body').on('mousedown touchstart' , '.lesson-quiz .answer', function(){
        
        keyboard = false;
        console.log("keyboard: " + keyboard);
    }).on('keydown', '.lesson-quiz .answer', function () {
        keyboard = true;
        console.log("keyboard: " + keyboard);
    }).on('change', '.lesson-quiz input' , function (){
        console.log("change " + keyboard);
        
        var $this = $(this),
            $container = $this.closest('.question'),
            $option = $this.closest('.answer');

        if (keyboard){
        $(this).closest('.question').find('.btn-submit-multichoice').show();
        }else {
            $(this).closest('.question').find('.btn-submit-multichoice').hide();
        }
        
    });

    
    $('form.lesson-quiz .answer input[type="radio"]').on("focus", function() {
        //console.log("focus");
        $(this).next("label").css("color", "#1878c9")
    });

    $('form.lesson-quiz .answer input[type="radio"]').on("blur", function() {
        //console.log("blur");
        $(this).next("label").css("color", "#383838"),
        "neutral" == $(this).attr("value") && $(this).next("label").css("color", "#000000")
    });

    $('form.lesson-quiz .answer label, form.lesson-quiz .answer input[type="radio"]').on("click", function() {
        console.log("click"); //gets fired twice
        $(this).closest(".question").find(".answer").css("background", "#f2f2f2")
        $(this).closest(".question").find(".indicator").css("background-position", "0px 0px").removeClass("checked");
        $(this).next("label").css("color", "#383838");
        var a = "#" + $(this).attr("data-radioval");
        console.log($(this));
        if ($(a).val() == "wrong"){
            
            $(this).closest(".answer").css("background", "#ffffff");
            $(this).closest(".question").find(".answer-reason").hide();

            if (!keyboard){
                $(this).closest(".answer").find(".indicator").css("background-position", "-25px 0px").addClass("checked");
                $(this).closest(".answer").find(".answer-reason").show();
            }else {
                console.log("keyboard2: " + keyboard)
                $(this).closest(".answer").find(".indicator").css("background-position", "-75px 0px").addClass("checked");
            }
        }
        
        else if ($(a).val() == "right"){
            
            $(this).closest(".answer").find(".indicator").show();
            $(this).closest(".answer").css("background", "#ffffff");
            $(this).closest(".question").find(".answer-reason").hide();

            if (!keyboard){
                $(this).closest(".answer").find(".indicator").css("background-position", "-50px 0px").addClass("checked");
                $(this).closest(".answer").find(".answer-reason").show();
            }
            else {
                console.log("keyboard2: " + keyboard)
                $(this).closest(".answer").find(".indicator").css("background-position", "-75px 0px").addClass("checked");
            }
        }

        
                
    })

    $(".btn-submit-multichoice").on('click' , function () {

        console.log("submit button");
        var $this = $(this);
        var $container = $this.closest('.lesson-quiz');
        var $options = $container.find('.answer');
        var $option = $options.find('.checked');
        var $specAnswer = $option.closest(".answer").find(".answer-reason");
        var $specButton = $option.closest(".answer").find("input");
        var $specIndicator = $option.closest(".answer").find(".indicator");
        var a = "#" + $specButton.attr("data-radioval");

        $specAnswer.show();

        console.log($(a).val());
        console.log($specButton.attr("data-radioval"));

        if ($(a).val() == "wrong"){
            console.log($container.find(".checked"));
            $container.find(".checked").css("background-position", "-25px 0px");
            //$options.find(".indicator").css("background-position", "-25px 0px");
        }else{
            console.log($container.find(".checked"));
            $container.find(".checked").css("background-position", "-50px 0px");
            //$options.find(".indicator").css("background-position", "-50px 0px");
        }

        
        
        
        
        
    });;

    
};
console.log("Current focus");
console.log(document.activeElement);
