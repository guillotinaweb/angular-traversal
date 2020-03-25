# Angular Traversal

**When routing is not good enough**

[![Build Status](https://travis-ci.org/guillotinaweb/angular-traversal.svg?branch=master)](https://travis-ci.org/guillotinaweb/angular-traversal)

## Demo

In this [demo](https://guillotinaweb.github.io/angular-traversal/dist/angular-traversal/) we allow to navigate in any public Github repository. There is not specific routing implemented in the app, we just rely on the Github routing itself.

## Why routing is not always good

Routing is the most common way to associate a given rendering to a given URL.

Let's think about a blog, `/` (the root) displays a list of the last blog posts, and each post has an URL like `/2017/01/11/angular-traversal`, and when the manager edits such a post, the URL is `/2017/01/11/angular-traversal/edit`.

Routing allows to manage that easily with 3 routes:

- `/` => use the home page template,
- `/:year/:month/:postid` => use the post template.
- `/:year/:month/:postid/edit` => use the post edition template.

And Angular provides a very good routing implementation (see [Angular Router](https://angular.io/docs/ts/latest/guide/router.html)).

This mechanism works perfectly for application-oriented websites (let's say an issue tracker for instance) or simple websites (like a blog). But, it does not fit the needs of complex websites.

Let's imagine a company website which can contain two types of pages: folders or simple pages:

- `/about` is a page,
- `/news` is a folder,
- `/news/welcome-our-new-president` is a page,
- `/news/archives` is a folder.

There is no way to enumerate all the possible routes for such a website: it would be too difficult to maintain (because the site structure will probably evolve regularly).

And more importantly, routes are restricted to the kind of content they render (we cannot use a route meant for rendering an article to render a user profile). So everytime we generate a link to a content in our app, we are supposed to know the appropriate route. That's the opposite of the web philosophy (when rendering a link in a page, our web browser does not have to know in advance if it will open another page or download a file).

That's why CMSes usually do not use routing.

We can imagine another example: we want to build an application to display a Git repository and we want to render differently the folders and the files.

We certainly want to use the current file or folder path as our current URL and as we cannot predict the repository tree structure, here again routing is not an option.

Note: and sometimes routing is the appropriate solution, but our backend service already implements it very well and we do not want to re-implement it another time in our frontend application.

## Meet traversal

Traversal is another approach, it analyses the current URL from its end to its begining in order to identify **the appropriate rendering** (we name it the *view*) and **the context resource** we want to render.

We use `@@` as a prefix to our view identifiers.

For instance, in `/news/@@edit`, `edit` is the view identifier, and `/news` is the context, so we know we want to display the `/news` content using the Edit form template.

Depending on the context, the same view identifier might be associated to a specific view implementation. For instance we probably have two different forms to edit a folder and to edit a page, but their respective URLs will both end with `/@@edit`.

The default view is `view`, so `/about` is equivalent to `/about/@@view`.

## When do we use traversal

- when the site/app navigation tree is not predicatable and can evolve,
- when we trust our backend to implement the navigation tree properly, and we do not want to re-implement it manually in the frontend.

## Angular Traversal features

Angular Traversal allows to associate a component to a view name for a given *context marker*, like:

```javascript
traverser.addView('view', 'Folder', FolderViewComponent);
traverser.addView('view', 'Document', DocumentViewComponent);
traverser.addView('edit', 'Folder', FolderEditComponent);
traverser.addView('edit', 'Document', DocumentEditComponent);
traverser.addView('history', '*', HistoryComponent);
```

### How do we insert a view in our app?

Just like the router, we specify the view rendering location using an outlet directive:
```html
<traverser-outlet></traverser-outlet>
```

### How do we create navigation links?

We create navigation links using a traverse directive:
```html
<a traverseTo="/news/2017/happy-new-year/@@edit">Edit</a>
```

### How the traverser will get the context from the current path?

The context is obtained from a *resolver* which takes the context path (e.g. `/news/2017/happy-new-year`) as parameter and returns the corresponding context as an object.

In many cases, we will retrieve this context from a backend, so Angular Traversal provides a basic HTTP resolver which just makes a GET using the context path and convert the resulting JSON into an object. But we can provide a custom resolver implementation easily.

The traverser will give this context object to the view component so it can be rendered.

If we traverse to a view without context (like ``@@login``), we will not re-call the resolver, we will just keep the current context and change the view.

### How the traverser knows which component to use?

As mentionned earlier, the view mapping is based on a *context marker* (in our example, we have `'Document'` and `'Folder'`). It is a string computed from the context object using a custom *marker* class.

For instance, if we want to associate a view according the content-type, assuming the backend JSON response contains a `type` property, our marker class would do:

```javascript
return context.type
```

And `'*'` allows to match any context.

Note: if our marker returns an array of strings, the traverser will pick the first
item of the array which matches a view definition.

### Tiles

The view component will render the main content.

But our application might also involves other blocks in the page, like a header, a side panel, a menu, etc.

Most of those blocks are the same, whatever is the current context, like our header will probably be rendered using the same component on all the pages of the app, even tough its content might vary depending on the context (in that case, we can subscribe to our traverse service to get the context and apply the needed changes).

But some blocks might be totally different from one context to another. Let's say we have a collapsible side panel providing extra action or detail information about the current context, when we are viewing a user account, we want to display the user preferences form, but when viewing a document, we want to display the modification history of this document. We do not want to implement those 2 cases in the same component. Of course we could manage it at the parent template level with `*ngIf="context.type==='user'"`, etc., but it is not scalable, hard to maintain and pretty ugly.

In that case, we can render our detail panel with a tile. Tile directives allow to define blocks in our parent template, each title has a name:

```html
<traverser-tile name="detail-panel"></traverser-tile>
```

And for each tile, we can declare components for our different possible context types:

```typescript
this.traverser.addTile('detail-panel', 'user', UserPreferencesComponent);
this.traverser.addTile('detail-panel', 'document', DocumentHistoryComponent);
```

And when we traverse to a given context, the relevant component will be used to render the tile.

Note: `noUpdateOnTraverse` attribute allows to manage the tile content independantly from traversing. We can load the context we want programmatically by calling:

```typescript
this.traverser.loadTile('details', '/news/the-rise-of-skywalker');
```

Note: an interesting aspect of the tile principle is the tile directive can be located in any template, and the corresponding module will not have any dependency with the component providing the tile content.

## Usage

### Create a view component

A valid view component must have a `context` property, it must inject the `Traverser` service, and subscribe to it to get the context:

```typescript
import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.css']
})
export class FolderEditComponent implements OnInit {

  private context: any;

  constructor(private traverser: Traverser) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      this.context = target.context;
    });
  }

}
```

Warning: before Angular 9, it must be declared in the app module **in both `declarations` and `entryComponents`**.

## Implement a marker

A valid marker must extend the `Marker` class and implent a `mark` method returning a string.

```typescript
import { Injectable } from '@angular/core';
import { Marker } from 'angular-traversal';

@Injectable()
export class TypeMarker extends Marker {
  mark(context: any): string {
      return context['@type']
  }
}
```

## Define a resolver

A valid resolver must extend the `Resolver` class and implement a `resolve` method returning an observable.

See BasicHttpResolver as example.

## Register views

We register view using the Traverser's `addView` method.
It can be done anywhere, but our main AppComponent class seems like a good place.

```typescript
import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { EditComponent } from './edit/edit.component';
import { FolderEditComponent } from './folder-edit/folder-edit.component';
import { HistoryComponent } from './history/history.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(traverser:Traverser) {
      traverser.addView('edit', 'Folder', FolderEditComponent);
      traverser.addView('edit', 'Document', EditComponent);
      traverser.addView('history', '*', HistoryComponent);
  }
}
```

## Insert the outlet and the links

To insert the view rendering:
```html
<traverser-outlet></traverser-outlet>
```

To create navigation links:
```html
<a traverseTo="/news/2017/happy-new-year/@@edit">Edit</a>
```

## Declare everything in the module

In `declarations` we need all our view components, (and they also need to be mentionned in `entryComponents` before Angular 9).

In 'imports', we need to import the TraversalModule.

In `providers`, we need:

- a resolver (if we use `BasicHttpResolver`, we also need the `BACKEND_BASE_URL` value),
- our custom marker.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TraversalModule } from 'angular-traversal';
import { Resolver } from 'angular-traversal';
import { Marker } from 'angular-traversal';
import { BasicHttpResolver, BACKEND_BASE_URL } from 'angular-traversal';

import { AppComponent } from './app.component';
import { EditComponent } from './edit/edit.component';
import { HistoryComponent } from './list/list.component';
import { FolderEditComponent } from './folder-edit/folder-edit.component';
import { TypeMarker } from './type-marker';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    HistoryComponent,
    FolderEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TraversalModule,
  ],
  providers: [
    { provide: Resolver, useClass: BasicHttpResolver },
    { provide: BACKEND_BASE_URL, useValue: 'http://my.backend.io' },
    { provide: Marker, useClass: TypeMarker },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Path normalizer

The main use case is to call a REST backend based on the current path.
For instance, by calling http://localhost:4200/guillotinaweb/angular-traversal/contents
the traverser will call https://api.github.com/repos/guillotinaweb/angular-traversal/contents
and use the result as the view context.

But, if the result contains some path to other resources, in most cases they will be
provided as full URL, like in our case with the GitHub API, the folder items are like that:

```json
{
    "name": "CHANGELOG.md",
    ...
    "url": "https://api.github.com/repos/guillotinaweb/angular-traversal/contents/CHANGELOG.md?ref=master",
    ...
}
```

So if we want to use this url to create a traversable link, we need to shorten it:

```html
<a traverseTo="/guillotinaweb/angular-traversal/contents/CHANGELOG.md?ref=master">CHANGELOG.md</a>
```

Of course, our resolver could support full pathes, but then the displayed location in the browser
would be:

```http://localhost:4200/https://api.github.com/repos/guillotinaweb/angular-traversal/contents/CHANGELOG.md?ref=master```

which does work, but is pretty ugly.

To avoid that, we can implement a Normalizer:
```typescript
import { Injectable } from '@angular/core';
import { Normalizer } from 'angular-traversal';

@Injectable()
export class FullPathNormalizer extends Normalizer {
  normalize(path): string {
    if (path.startsWith('https://api.github.com/repos')) {
      return path.slice(28);
    } else {
      return path;
    }
  }
}
```
and provide it in the module:
```typescript
import { Normalizer } from 'angular-traversal';
import { FullPathNormalizer } from './my-normalizer';
...
  { provide: Normalizer, useClass: FullPathNormalizer },
...
```

## Using traversal and routing together

Traversing can be used with regular routing.

Some pathes our application can be managed with routing (example: `/login`, `/profile`, etc.), and others with traversing (like: `/files/**`).

`/files` will be a route and its component will contain the outlet with a special input:

```html
<traverser-outlet></traverser-outlet>
```

Note: with `noAutoTraverse`, we will not traverse to the new location everytime the location changes. 

In our app module, we will declare our prefix:

```typescript
{ provide: NAVIGATION_PREFIX, useValue: '/files' },
```

And in order to make sure the transition between the 2 modes work fine, we will have to do (in app.component for example):

```typescript
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
        this.traverser.traverseHere();
    });
```

Note: if we want to use routing as a secondary system within traversal, we can make our resolver and marker aware of routes, example:

```typescript
    resolve(path: string, view: string, queryString: string): Observable<Something|{isRoute: boolean}> {
        const level1 = path.split('/')[1] || '';
        if (!level1 || MY_SUB_ROUTES.includes(level1)) {
            return of({isRoute: true});
        } else {
            return this.somethingService.get(path);
        }
    }
```

and

```typescript
    mark(context: any): string {
        if (context.isRoute) {
            return 'routing';
        } else {
            ...
        }
    }
```

then declare a view for the fake `routing` type:

```typescript
traverser.addView('view', 'routing', DefaultRouterComponent);
```

(`DefaultRouterComponent` will contain the `<router-outlet>`)

## Lazy loading

*Note: only supported since Angular 9*

Similarly to Angular Router, in order to reduce our main bundle size, we can lazy load the view components.

Let's say we have a specific view involving a lot of code and most users won't use it. We create this component in its own module, and we declare the views in a static property named `traverserViews`:

```typescript
@NgModule({
    imports: [],
    exports: [HugeDashboardComponent],
    declarations: [HugeDashboardComponent],
    providers: [],
})
export class HugeDashboardModule {
    static traverserViews: ViewMapping[] = [
        {name: 'dashboard', components: {'Folder': HugeDashboardComponent}},
    ];
    static traverserTiles: ViewMapping[] = [
        {name: 'dashboard-sidepanel', components: {'Folder': HugeDashboardDetailsComponent}},
    ];
}
```

Lazy views and/or tiles are declared like this:

```typescript
traverser.addLazyView('dashboard', 'Folder', () => import('./folder-dashboard/module').then(m => m.HugeDashboardModule));
traverser.addLazyTile('dashboard-sidepanel', 'Folder', () => import('./folder-dashboard/module').then(m => m.HugeDashboardModule));
```

## Other demo package

[Plone demo package](https://github.com/ebrehault/angular-traversal-demo)
