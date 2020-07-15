import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Activity } from 'src/app/models/activity';
import { GetActivities } from '../actions/activity.action';
import { ActivityService } from 'src/app/activities/activity.service';
import { tap } from 'rxjs/operators';

export class ActivitiesStateModel {
    Activities:Activity[]
}

@State<ActivitiesStateModel>({
    name: 'activities',
    defaults: {
        Activities: []


    }
})
export class ActivityState {

    constructor(private activityService:ActivityService) {
    }

    @Selector()
    static GetActivities(state: ActivitiesStateModel) {
        return state.Activities;
    }

    @Action(GetActivities)
    getActivities({ getState, setState }: StateContext<GetActivities>) {
        return this.activityService.getActivityList().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                Activities: result
            });
        }))

     
    }

   
}