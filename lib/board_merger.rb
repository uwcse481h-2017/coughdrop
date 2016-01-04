module BoardMerger
  def self.diff(pre, post)
    # map grids to guid-style grid
    # try to fit old grid to a (potentially partially off-grid) region of new grid
    #   if fits, record row and column adds with pre grid for reference
    #   if no fit, record rearrange event with pre grid for reference
    # find each button in pre and post
    #   if in pre but not post, record delete event with pre button for reference
    #   if in post but not pre, record create event
    #   if in pre and post
    #     collect all changed values
    #     record pre, post, and diff in a single event
  end
  
  def revision_list(n, n_plus_one)
    # get the diff between the two versions
    # create events for row and column add and deletes
    #   this should include the grid attribute of the board before the edit
    #   (if all existing buttons can be fit to a (potentially partly off-grid) region)
    # there is the messy case where buttons got moved *and* rows were added or removed
    #   in this case just track the prior grid
    #   (grid can't be find to a (potentially partially off-grid) region)
    # create events for new button creation
    #   (new button guid)
    # delete events for existing buttons
    #   include state of button before it was removed
    #   (guid no longer exists)
    # create events for each button that changed -- one event per button
    #   these events should include the state of the button before the edit
    #   (guid still there, something other than id was changed)
  end
  
  def full_revision_list(start_ref, end_ref)
    # for each revision between start and end
    #   collect the revision_list
  end
  
  def human_readable_edit_event(event)
    # "added a row to the top/to the bottom/at index X"
    # "removed the top row/the bottom row/the row at index X"
    # "moved the button (label+image) from r1c1 to r1c3" (this may be too hard to get)
    # "rearranged and added or removed multiple buttons"
    # "changed the button (label+image): label to X, color to X, image to X"
  end
  
  def merge_changes(final: nil, ref: nil)
    # if boards have a matching revision point:
    #   find latest matching revision point:
    #     get the full_revision_list on ref since that revision point
    #     for each edit event:
    #       if final still matches the pre state:
    #         apply to final
    #       otherwise keep edit information for merge report
    #  otherwise: (don't let's support this quite yet)
    #    for each button in final:
    #      find the button at the same index
    #      fill in any empty values with the values from ref
  end
end