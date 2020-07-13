import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Friend } from 'src/app/models/friend';
import { GetFriends } from '../actions/friend.action';
import { UserService } from 'src/app/users/user.service';
import { tap } from 'rxjs/operators';

export class FriendsStateModel {
  Friends:Friend[]
}

@State<FriendsStateModel>({
    name: 'friends',
    defaults: {
        Friends: []


    }
})
export class FriendState {

    constructor(private userService:UserService) {
    }

    @Selector()
    static getFriends(state: FriendsStateModel) {
        return state.Friends;
    }

    @Action(GetFriends)
    getFriends({ getState, setState }: StateContext<GetFriends>) {
        return this.userService.getFriendList().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                Friends: result
            });
        }))

     
    }

   
}