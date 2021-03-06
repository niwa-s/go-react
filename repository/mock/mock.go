package mock

import (
	"context"
	"math/rand"
	"strings"
	"sync"
	"time"

	"github.com/niwa-s/go-react/repository"
)

type Repository struct {

}

var mu sync.RWMutex

var lorem = strings.Split(`lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`, " ")

var articleIDCounter int64 = 1
var commentIDCounter int64 = 1
var mockArticles []repository.Article
var mockComments []repository.Comment

func RandomWord() string {
	return lorem[rand.Intn(len(lorem))]
}

func RandomName() string {
	return strings.Title(RandomWord()) + " " + strings.Title(RandomWord())
}

func RandomTitle() string {
	words := make([]string, 3 + rand.Intn(3))
	for i := range words {
		words[i] = RandomWord()
	}
	return strings.Title(strings.Join(words, " "))
}

func randomText() string {
	words := make([]string, 6+rand.Intn(6))
	for j := range words {
		words[j] = RandomWord()
	}
	return strings.Title(strings.Join(words, " ")) + "."
}
func RandomParagraph() string {
	paragraph := make([]string, 7+rand.Intn(5))
	for i := range paragraph {
		paragraph[i] = randomText()
	}
	return strings.Join(paragraph, " ")
}
func RandomArticle() string {
	article := make([]string, 5+rand.Intn(3))
	for i := range article {
		article[i] = RandomParagraph()
	}
	return strings.Join(article, "\n\n")
}

func init() {
	var repo Repository
	for i := 0; i < 10; i++ {
		articleCreatedAt := time.Date(2010, 0, rand.Intn(365)*10, 0, 0, 0, 0, time.UTC)
		a, err := repo.SaveArticles(context.TODO(), RandomTitle(), RandomArticle(), RandomName(), articleCreatedAt)
		if err != nil {
			panic(err)
		}

		for j := 0; j < 2+rand.Intn(10); j++ {
			commentCreatedAt := articleCreatedAt.Add(time.Duration(rand.Intn(365)) * 24 * time.Hour)
			_, err := repo.SaveComment(context.TODO(), a.ID, RandomName(), RandomParagraph(), commentCreatedAt)
			if err != nil {
				panic(err)
			}
		}
	}
}