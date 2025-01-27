//import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const getTweetsData = localStorage.getItem('tweetsData')
let tweetsData = JSON.parse(getTweetsData)


console.log(tweetsData)

const tweetBtn = document.getElementById('tweet-btn')
const tweetInput = document.getElementById('tweet-input')
const deleteBtn = document.getElementById('delete-btn')

tweetBtn.addEventListener('click',postTweet)


document.addEventListener('click',function(e){
    if(e.target.dataset.like)
        handleLikes(e.target.dataset.like)
    else if(e.target.dataset.retweet)
        handleRetweets(e.target.dataset.retweet)
    else if(e.target.dataset.replies)
        handleShowReplies(e.target.dataset.replies)
    else if(e.target.dataset.reply)
        handleReplyTweet(e.target.dataset.reply)
})

function handleReplyTweet(tweetId)
{
    const TweetText = document.getElementById(`tweet-reply-${tweetId}`)
    const replyBtn = document.getElementById(`reply-btn-${tweetId}`)
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    TweetText.classList.toggle('hidden')

    const tweet = tweetsData.find((obj) => obj.uuid === tweetId)

    replyBtn.addEventListener('click',function(){
            console.log(tweet)
            if(replyInput.value)
            {
                tweet.replies.unshift({
                    handle: '@Tariq',
                    profilePic: 'images/scrimbalogo.png',
                    tweetText: replyInput.value
                })
            }
            render()
            })

            

}

function handleLikes(tweetId)
{
    const handleTweetLikes = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]

    if(handleTweetLikes.isLiked)
        handleTweetLikes.likes--
    else
        handleTweetLikes.likes++

        handleTweetLikes.isLiked = !handleTweetLikes.isLiked

        render()
}

function handleRetweets(tweetId)
{
    const handleTweetRetweets = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]

    if(handleTweetRetweets.isRetweeted)
        handleTweetRetweets.retweets--
    else
        handleTweetRetweets.retweets++

        handleTweetRetweets.isRetweeted = !handleTweetRetweets.isRetweeted

        render()

}

function handleShowReplies(tweetId)
{
    document.getElementById(`reply-${tweetId}`).classList.toggle('hidden')
}

function postTweet()
{
    if(tweetInput.value)
    {
        tweetsData.unshift({
            handle: '@Tariq',
            profilePic: 'images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        render()
        tweetInput.value = ''
    }
    


   
}

function getTweets()
{
    let Tweets = ''

    tweetsData.forEach(function(tweet){

        let isLiked = ''
        let isRetweet = ''

        if(tweet.isLiked)
            isLiked = 'liked'

        if(tweet.isRetweeted)
            isRetweet = 'retweet'


        let repliesHtml = ''
        if(tweet.replies.length > 0)
        {
            tweet.replies.forEach(function(reply){
                repliesHtml += `<div class="tweet-reply">
                <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle"> ${reply.handle} </p>
                        <p class="tweet-text"> ${reply.tweetText} </p>
                    </div>
                </div> 
            
            </div>`
            })
            

            
        }

        

        Tweets += ` <div class="tweet">
                        <div class="tweet-inner"> 
                            <img src="${tweet.profilePic}" class="profile-pic">
                                <div>
                                <p class = "handle">${tweet.handle}</p>
                                <p class = "tweet-text">${tweet.tweetText}</p>
                                    <div class="tweet-details"> 
                                        <span class="tweet-detail"> 
                                            <i class="fa-regular fa-comment-dots"
                                                data-replies="${tweet.uuid}"></i>
                                            ${tweet.replies.length}
                                        </span>
                                         <span class="tweet-detail"> 
                                            <i class="fa-solid fa-heart ${isLiked}" 
                                                data-like="${tweet.uuid}"></i>
                                            ${tweet.likes}
                                        </span>
                                         <span class="tweet-detail"> 
                                            <i class="fa-solid fa-retweet ${isRetweet}"
                                                data-retweet="${tweet.uuid}"></i>
                                            ${tweet.retweets}
                                        </span>
                                        <span class="tweet-detail"> 
                                            <i class="fa-solid fa-reply" 
                                            data-reply='${tweet.uuid}'></i> 
                                        </span>
                                    </div>
                                </div>

                        </div> 
                        <div class="hidden" id="reply-${tweet.uuid}">
                            ${repliesHtml}
                        </div>
                        <div class="hidden" id='tweet-reply-${tweet.uuid}'>
                            <textarea id='reply-input-${tweet.uuid}' class='reply-textarea' cols='40' rows='4'></textarea>
                            <button class='reply-btn' id='reply-btn-${tweet.uuid}'>Reply </button>
                        </div>
        
                    </div>
        
        `
    })

    return Tweets;
}

function UpdateDataInLocalStorage()
{
    localStorage.setItem('tweetsData',JSON.stringify(tweetsData))
}

function render()
{
    UpdateDataInLocalStorage()
    document.getElementById('feed').innerHTML = getTweets()
}

render()